import { create } from "zustand";
import {
  clientService,
  productService,
  templateService,
} from "../services/api";
import toast from "react-hot-toast";

export const useAppStore = create((set, get) => ({
  clients: [],
  products: [],
  templates: [],
  loading: false,

  fetchClients: async () => {
    set({ loading: true });
    try {
      const { data } = await clientService.getAll();
      set({ clients: data });
    } catch {
      toast.error("Failed to load clients");
    } finally {
      set({ loading: false });
    }
  },
  createClient: async (data) => {
    try {
      await clientService.create(data);
      toast.success("Client created successfully!");
      get().fetchClients();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create client");
      return false;
    }
  },
  updateClient: async (id, data) => {
    try {
      await clientService.update(id, data);
      toast.success("Client updated successfully!");
      get().fetchClients();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update client");
      return false;
    }
  },
  deleteClient: async (id) => {
    try {
      await clientService.delete(id);
      toast.success("Client deleted successfully!");
      get().fetchClients();
    } catch {
      toast.error("Failed to delete client");
    }
  },

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const { data } = await productService.getAll();
      set({ products: data });
    } catch {
      toast.error("Failed to load products");
    } finally {
      set({ loading: false });
    }
  },
  createProduct: async (data) => {
    try {
      await productService.create(data);
      toast.success("Product created successfully!");
      get().fetchProducts();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create product");
      return false;
    }
  },
  updateProduct: async (id, data) => {
    try {
      await productService.update(id, data);
      toast.success("Product updated successfully!");
      get().fetchProducts();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update product");
      return false;
    }
  },
  deleteProduct: async (id) => {
    try {
      await productService.delete(id);
      toast.success("Product deleted successfully!");
      get().fetchProducts();
    } catch {
      toast.error("Failed to delete product");
    }
  },

  fetchTemplates: async () => {
    set({ loading: true });
    try {
      const { data } = await templateService.getAll();
      set({ templates: data });
    } catch {
      toast.error("Failed to load templates");
    } finally {
      set({ loading: false });
    }
  },
  createTemplate: async (data) => {
    try {
      await templateService.create(data);
      toast.success("Template created successfully!");
      get().fetchTemplates();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create template");
      return false;
    }
  },
  updateTemplate: async (id, data) => {
    try {
      await templateService.update(id, data);
      toast.success("Template updated successfully!");
      get().fetchTemplates();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update template");
      return false;
    }
  },
  deleteTemplate: async (id) => {
    try {
      await templateService.delete(id);
      toast.success("Template deleted successfully!");
      get().fetchTemplates();
    } catch {
      toast.error("Failed to delete template");
    }
  },
}));
