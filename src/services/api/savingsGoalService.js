import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const savingsGoalService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('savingsGoals_c', {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "target_amount_c"}},
          {"field": {"Name": "current_amount_c"}},
          {"field": {"Name": "deadline_c"}},
          {"field": {"Name": "priority_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      const goals = response.data.map(item => ({
        Id: item.Id,
        name: item.name_c,
        targetAmount: item.target_amount_c,
        currentAmount: item.current_amount_c || 0,
        deadline: item.deadline_c,
        priority: item.priority_c
      }));

      // Sort by priority
      return goals.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    } catch (error) {
      console.error("Error fetching savings goals:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('savingsGoals_c', id, {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "target_amount_c"}},
          {"field": {"Name": "current_amount_c"}},
          {"field": {"Name": "deadline_c"}},
          {"field": {"Name": "priority_c"}}
        ]
      });

      if (!response?.data) {
        return null;
      }

      return {
        Id: response.data.Id,
        name: response.data.name_c,
        targetAmount: response.data.target_amount_c,
        currentAmount: response.data.current_amount_c || 0,
        deadline: response.data.deadline_c,
        priority: response.data.priority_c
      };
    } catch (error) {
      console.error(`Error fetching savings goal ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(goalData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          name_c: goalData.name,
          target_amount_c: goalData.targetAmount,
          current_amount_c: 0,
          deadline_c: goalData.deadline,
          priority_c: goalData.priority
        }]
      };

      const response = await apperClient.createRecord('savingsGoals_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} savings goals:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            name: item.name_c,
            targetAmount: item.target_amount_c,
            currentAmount: item.current_amount_c || 0,
            deadline: item.deadline_c,
            priority: item.priority_c
          };
        }
      }
    } catch (error) {
      console.error("Error creating savings goal:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, goalData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Id: parseInt(id),
          name_c: goalData.name,
          target_amount_c: goalData.targetAmount,
          current_amount_c: goalData.currentAmount,
          deadline_c: goalData.deadline,
          priority_c: goalData.priority
        }]
      };

      const response = await apperClient.updateRecord('savingsGoals_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} savings goals:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            name: item.name_c,
            targetAmount: item.target_amount_c,
            currentAmount: item.current_amount_c || 0,
            deadline: item.deadline_c,
            priority: item.priority_c
          };
        }
      }
    } catch (error) {
      console.error("Error updating savings goal:", error?.response?.data?.message || error);
      return null;
    }
  },

  async addContribution(id, amount) {
    try {
      // First get current goal data
      const currentGoal = await this.getById(id);
      if (!currentGoal) {
        throw new Error("Savings goal not found");
      }

      // Update with new amount
      const newCurrentAmount = currentGoal.currentAmount + amount;
      return await this.update(id, {
        ...currentGoal,
        currentAmount: newCurrentAmount
      });
    } catch (error) {
      console.error("Error adding contribution:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('savingsGoals_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} savings goals:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting savings goal:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getGoalsSummary() {
    try {
      const goals = await this.getAll();
      const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
      const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
      const totalRemaining = totalTargetAmount - totalCurrentAmount;
      const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;
      
      const activeGoals = goals.filter(goal => goal.currentAmount < goal.targetAmount);
      const completedGoals = goals.filter(goal => goal.currentAmount >= goal.targetAmount);

      return {
        totalTargetAmount,
        totalCurrentAmount,
        totalRemaining,
        overallProgress,
        activeGoalsCount: activeGoals.length,
        completedGoalsCount: completedGoals.length,
        totalGoalsCount: goals.length
      };
    } catch (error) {
      console.error("Error getting goals summary:", error?.response?.data?.message || error);
      return {
        totalTargetAmount: 0,
        totalCurrentAmount: 0,
        totalRemaining: 0,
        overallProgress: 0,
        activeGoalsCount: 0,
        completedGoalsCount: 0,
        totalGoalsCount: 0
      };
    }
  }
};