import { useEffect, useState, useCallback } from "react";
import { getAllUsers, getUserById } from "@/services/userApi";
import axiosInstance from "@/lib/axios";
import { User } from "@/types/user";
import { toast } from "react-toastify";

export function useUsers(initialFilters: any = {}) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      // Since backend doesn't seem to have query filtering for users yet, 
      // we'll fetch all and provide the data.
      setUsers(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch users. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const deleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    
    try {
      const response = await axiosInstance.delete(`/user/${id}`);
      if (response.data.success) {
        toast.success("User deleted successfully");
        fetchUsers();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error deleting user");
    }
  };

  const fetchUserDetail = async (id: string) => {
    try {
      const response = await getUserById(id);
      return response.data;
    } catch (err: any) {
      toast.error("Failed to fetch user details");
      return null;
    }
  };

  return { 
    users, 
    loading, 
    error, 
    refresh: fetchUsers,
    deleteUser,
    fetchUserDetail
  };
}
