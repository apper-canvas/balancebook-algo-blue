import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const transactionService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('transactions_c', {
        fields: [
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "category_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        amount: item.amount_c,
        type: item.type_c,
        date: item.date_c,
        description: item.description_c,
        notes: item.notes_c,
        category: item.category_c?.Name || 'Unknown'
      }));
    } catch (error) {
      console.error("Error fetching transactions:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('transactions_c', id, {
        fields: [
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "category_c"}}
        ]
      });

      if (!response?.data) {
        return null;
      }

      return {
        Id: response.data.Id,
        amount: response.data.amount_c,
        type: response.data.type_c,
        date: response.data.date_c,
        description: response.data.description_c,
        notes: response.data.notes_c,
        category: response.data.category_c?.Name || 'Unknown'
      };
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async getByMonth(month) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('transactions_c', {
        fields: [
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "category_c"}}
        ],
        where: [{
          "FieldName": "date_c",
          "Operator": "ExactMatch",
          "SubOperator": "Month",
          "Values": [month]
        }],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(Failed to fetch {service name}:, response);
        toast.error(response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        amount: item.amount_c,
        type: item.type_c,
        date: item.date_c,
        description: item.description_c,
        notes: item.notes_c,
        category: item.category_c?.Name || 'Unknown'
      }));
    } catch (error) {
      console.error("Error fetching transactions by month:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByCategory(category) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('transactions_c', {
        fields: [
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "category_c"}}
        ],
        where: [{
          "FieldName": "category_c",
          "Operator": "ExactMatch",
          "Values": [category]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        amount: item.amount_c,
        type: item.type_c,
        date: item.date_c,
        description: item.description_c,
        notes: item.notes_c,
        category: item.category_c?.Name || 'Unknown'
      }));
    } catch (error) {
      console.error("Error fetching transactions by category:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(transactionData) {
    try {
      const apperClient = getApperClient();
      
      // Get category ID by name
      const categoryResponse = await apperClient.fetchRecords('categories_c', {
        fields: [{"field": {"Name": "name_c"}}],
        where: [{
          "FieldName": "name_c",
          "Operator": "ExactMatch",
          "Values": [transactionData.category]
        }]
      });

      let categoryId = null;
      if (categoryResponse.success && categoryResponse.data.length > 0) {
        categoryId = categoryResponse.data[0].Id;
      }

      const params = {
        records: [{
          amount_c: transactionData.amount,
          type_c: transactionData.type,
          date_c: transactionData.date,
          description_c: transactionData.description,
          notes_c: transactionData.notes,
          category_c: categoryId
        }]
      };

      const response = await apperClient.createRecord('transactions_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} transactions:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            amount: item.amount_c,
            type: item.type_c,
            date: item.date_c,
            description: item.description_c,
            notes: item.notes_c,
            category: transactionData.category
          };
        }
      }
    } catch (error) {
      console.error("Error creating transaction:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, transactionData) {
    try {
      const apperClient = getApperClient();
      
      // Get category ID by name
      const categoryResponse = await apperClient.fetchRecords('categories_c', {
        fields: [{"field": {"Name": "name_c"}}],
        where: [{
          "FieldName": "name_c",
          "Operator": "ExactMatch",
          "Values": [transactionData.category]
        }]
      });

      let categoryId = null;
      if (categoryResponse.success && categoryResponse.data.length > 0) {
        categoryId = categoryResponse.data[0].Id;
      }

      const params = {
        records: [{
          Id: parseInt(id),
          amount_c: transactionData.amount,
          type_c: transactionData.type,
          date_c: transactionData.date,
          description_c: transactionData.description,
          notes_c: transactionData.notes,
          category_c: categoryId
        }]
      };

      const response = await apperClient.updateRecord('transactions_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} transactions:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            amount: item.amount_c,
            type: item.type_c,
            date: item.date_c,
            description: item.description_c,
            notes: item.notes_c,
            category: transactionData.category
          };
        }
      }
    } catch (error) {
      console.error("Error updating transaction:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('transactions_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} transactions:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting transaction:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getIncomeExpenseTrend(months) {
    const trendData = [];
    
    for (const month of months) {
      const monthTransactions = await this.getByMonth(month);
      const income = monthTransactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      const expenses = monthTransactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
      
      trendData.push({
        month,
        income,
        expenses,
        net: income - expenses
      });
    }
    
    return trendData;
  },

  async getCategoryBreakdown(month) {
    try {
      const monthTransactions = await this.getByMonth(month);
      const expenseTransactions = monthTransactions.filter(t => t.type === "expense");
      
      const categoryTotals = expenseTransactions.reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      }, {});

      return Object.entries(categoryTotals).map(([category, amount]) => ({
        category,
        amount
      }));
    } catch (error) {
      console.error("Error getting category breakdown:", error?.response?.data?.message || error);
      return [];
    }
  }
};
