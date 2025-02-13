import { defineStore } from 'pinia';

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    items: [],
    categories: []
  }),
  actions: {
    async fetchItems() {
      try {
        const response = await fetch('https://67ae193d9e85da2f020c6700.mockapi.io/api/v2/inventories');
        this.items = await response.json();
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    },
    async fetchItem(id) {
      try {
        const response = await fetch(`https://67ae193d9e85da2f020c6700.mockapi.io/api/v2/inventories/${id}`);
        return await response.json();
      } catch (error) {
        console.error('Error fetching item:', error);
      }
    },
    async fetchCategories() {
      try {
        const response = await fetch('https://67ae193d9e85da2f020c6700.mockapi.io/api/v2/categories');
        this.categories = await response.json();
        return this.categories;
      } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
    },
    async createItem(itemData) {
      try {
        const response = await fetch('https://67ae193d9e85da2f020c6700.mockapi.io/api/v2/inventories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(itemData),
        });
        const newItem = await response.json();
        this.items.push(newItem);
        return newItem;
      } catch (error) {
        console.error('Error creating item:', error);
      }
    },
    async updateItem(id, itemData) {
      try {
        const response = await fetch(`https://67ae193d9e85da2f020c6700.mockapi.io/api/v2/inventories/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(itemData),
        });
        const updatedItem = await response.json();
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
          this.items[index] = updatedItem;
        }
        return updatedItem;
      } catch (error) {
        console.error('Error updating item:', error);
      }
    },
    async deleteItem(id) {
      try {
        await fetch(`https://67ae193d9e85da2f020c6700.mockapi.io/api/v2/inventories/${id}`, {
          method: 'DELETE',
        });
        this.items = this.items.filter(item => item.id !== id);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    },
  },
});