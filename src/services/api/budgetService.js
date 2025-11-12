import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const budgetService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('budgets_c', {
        fields: [
          {"field": {"Name": "monthly_limit_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "spent_c"}},
          {"field": {"Name": "rollover_c"}},
          {"field": {"Name": "category_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        monthlyLimit: item.monthly_limit_c,
        month: item.month_c,
        spent: item.spent_c || 0,
        rollover: item.rollover_c || 0,
        category: item.category_c?.Name || 'Unknown'
      }));
    } catch (error) {
      console.error("Error fetching budgets:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('budgets_c', id, {
        fields: [
          {"field": {"Name": "monthly_limit_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "spent_c"}},
          {"field": {"Name": "rollover_c"}},
          {"field": {"Name": "category_c"}}
        ]
      });

      if (!response?.data) {
        return null;
      }

      return {
        Id: response.data.Id,
        monthlyLimit: response.data.monthly_limit_c,
        month: response.data.month_c,
        spent: response.data.spent_c || 0,
        rollover: response.data.rollover_c || 0,
        category: response.data.category_c?.Name || 'Unknown'
      };
    } catch (error) {
      console.error(`Error fetching budget ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async getByMonth(month) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('budgets_c', {
        fields: [
          {"field": {"Name": "monthly_limit_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "spent_c"}},
          {"field": {"Name": "rollover_c"}},
          {"field": {"Name": "category_c"}}
        ],
        where: [{
          "FieldName": "month_c",
          "Operator": "ExactMatch",
          "Values": [month]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        monthlyLimit: item.monthly_limit_c,
        month: item.month_c,
        spent: item.spent_c || 0,
        rollover: item.rollover_c || 0,
        category: item.category_c?.Name || 'Unknown'
      }));
    } catch (error) {
      console.error("Error fetching budgets by month:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(budgetData) {
    try {
      const apperClient = getApperClient();
      
      // Get category ID by name
      const categoryResponse = await apperClient.fetchRecords('categories_c', {
        fields: [{"field": {"Name": "name_c"}}],
        where: [{
          "FieldName": "name_c",
          "Operator": "ExactMatch",
          "Values": [budgetData.category]
        }]
      });

      let categoryId = null;
      if (categoryResponse.success && categoryResponse.data.length > 0) {
        categoryId = categoryResponse.data[0].Id;
      }

      const params = {
        records: [{
          monthly_limit_c: budgetData.monthlyLimit,
          month_c: budgetData.month,
          spent_c: 0,
          rollover_c: 0,
          category_c: categoryId
        }]
      };

      const response = await apperClient.createRecord('budgets_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} budgets:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            monthlyLimit: item.monthly_limit_c,
            month: item.month_c,
            spent: item.spent_c || 0,
            rollover: item.rollover_c || 0,
            category: budgetData.category
          };
        }
      }
    } catch (error) {
      console.error("Error creating budget:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, budgetData) {
    try {
      const apperClient = getApperClient();
      
      // Get category ID by name if category is provided
      let categoryId = null;
      if (budgetData.category) {
        const categoryResponse = await apperClient.fetchRecords('categories_c', {
          fields: [{"field": {"Name": "name_c"}}],
          where: [{
            "FieldName": "name_c",
            "Operator": "ExactMatch",
            "Values": [budgetData.category]
          }]
        });

        if (categoryResponse.success && categoryResponse.data.length > 0) {
          categoryId = categoryResponse.data[0].Id;
        }
      }

      const params = {
        records: [{
          Id: parseInt(id),
          monthly_limit_c: budgetData.monthlyLimit,
          month_c: budgetData.month,
          spent_c: budgetData.spent,
          rollover_c: budgetData.rollover,
          ...(categoryId && { category_c: categoryId })
        }]
      };

      const response = await apperClient.updateRecord('budgets_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} budgets:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            monthlyLimit: item.monthly_limit_c,
            month: item.month_c,
            spent: item.spent_c || 0,
            rollover: item.rollover_c || 0,
            category: budgetData.category
          };
        }
      }
    } catch (error) {
      console.error("Error updating budget:", error?.response?.data?.message || error);
      return null;
    }
  },

  async updateSpent(category, month, amount) {
    try {
      // Find budget by category and month
      const budgets = await this.getByMonth(month);
      const budget = budgets.find(b => b.category === category);
      
      if (budget) {
        return await this.update(budget.Id, {
          ...budget,
          spent: amount
        });
      }
      return null;
    } catch (error) {
      console.error("Error updating spent amount:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('budgets_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} budgets:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting budget:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getBudgetSummary(month) {
    try {
      const monthBudgets = await this.getByMonth(month);
      const totalBudget = monthBudgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
      const totalSpent = monthBudgets.reduce((sum, b) => sum + b.spent, 0);
      const remaining = totalBudget - totalSpent;
      const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

      return {
        totalBudget,
        totalSpent,
        remaining,
        percentage,
        categories: monthBudgets.length
      };
    } catch (error) {
      console.error("Error getting budget summary:", error?.response?.data?.message || error);
      return {
        totalBudget: 0,
        totalSpent: 0,
        remaining: 0,
        percentage: 0,
        categories: 0
      };
    }
  }
};