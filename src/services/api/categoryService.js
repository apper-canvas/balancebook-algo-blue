import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const categoryService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('categories_c', {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "is_custom_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        name: item.name_c,
        color: item.color_c,
        icon: item.icon_c,
        isCustom: item.is_custom_c
      }));
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('categories_c', id, {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "is_custom_c"}}
        ]
      });

      if (!response?.data) {
        return null;
      }

      return {
        Id: response.data.Id,
        name: response.data.name_c,
        color: response.data.color_c,
        icon: response.data.icon_c,
        isCustom: response.data.is_custom_c
      };
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async getByName(name) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('categories_c', {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "is_custom_c"}}
        ],
        where: [{
          "FieldName": "name_c",
          "Operator": "ExactMatch",
          "Values": [name]
        }]
      });

      if (!response?.data?.length) {
        return null;
      }

      const item = response.data[0];
      return {
        Id: item.Id,
        name: item.name_c,
        color: item.color_c,
        icon: item.icon_c,
        isCustom: item.is_custom_c
      };
    } catch (error) {
      console.error("Error fetching category by name:", error?.response?.data?.message || error);
      return null;
    }
  },

  async create(categoryData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          name_c: categoryData.name,
          color_c: categoryData.color,
          icon_c: categoryData.icon,
          is_custom_c: true
        }]
      };

      const response = await apperClient.createRecord('categories_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} categories:`, failed);
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
            color: item.color_c,
            icon: item.icon_c,
            isCustom: item.is_custom_c
          };
        }
      }
    } catch (error) {
      console.error("Error creating category:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, categoryData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Id: parseInt(id),
          name_c: categoryData.name,
          color_c: categoryData.color,
          icon_c: categoryData.icon,
          is_custom_c: categoryData.isCustom
        }]
      };

      const response = await apperClient.updateRecord('categories_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} categories:`, failed);
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
            color: item.color_c,
            icon: item.icon_c,
            isCustom: item.is_custom_c
          };
        }
      }
    } catch (error) {
      console.error("Error updating category:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('categories_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} categories:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting category:", error?.response?.data?.message || error);
      return false;
    }
  }
};