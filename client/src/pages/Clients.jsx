import { useState, useEffect } from "react";
import { useAppStore } from "../store/useAppStore";
import {
  Users,
  Search,
  ArrowLeft,
  Loader2,
  UserPlus,
  Sparkles,
  Grid3x3,
} from "lucide-react";
import ClientForm from "../components/clients/ClientForm";
import ClientTable from "../components/clients/ClientTable";

const Clients = () => {
  const {
    clients,
    loading,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
  } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleSubmit = async (data) => {
    setSaving(true);
    const success = editingClient
      ? await updateClient(editingClient.id, data)
      : await createClient(data);
    setSaving(false);

    if (success) {
      setIsEditing(false);
      setEditingClient(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this client?")) {
      await deleteClient(id);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setEditingClient(null);
    setIsEditing(true);
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading && clients.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-emerald-50">
        <div className="text-center">
          <Loader2
            className="animate-spin text-emerald-700 mx-auto mb-4"
            size={40}
          />
          <p className="text-sm font-semibold text-gray-600">
            Loading clients...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section — matches Products exactly */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-lg shadow-emerald-200">
                <Users size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                  Clients
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-1 w-1 rounded-full bg-emerald-600"></div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {clients.length}{" "}
                    {clients.length === 1 ? "Customer" : "Customers"} in
                    database
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isEditing && (
              <div className="relative group">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all text-sm font-medium w-64 shadow-sm hover:shadow-md"
                />
              </div>
            )}

            {!isEditing ? (
              <button
                onClick={handleAddNew}
                className="group flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 hover:-translate-y-0.5"
              >
                <UserPlus
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
                Add Client
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-md"
              >
                <ArrowLeft size={18} />
                Back to List
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        {isEditing ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ClientForm
                initialData={editingClient}
                onSubmit={handleSubmit}
                onCancel={() => setIsEditing(false)}
                saving={saving}
              />
            </div>

            {/* Sidebar — matches Products sidebar */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl p-7 text-white shadow-xl shadow-emerald-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                <div className="relative">
                  <div className="p-3 bg-white/20 rounded-2xl w-fit mb-4 backdrop-blur-sm">
                    <Sparkles size={24} className="text-white" />
                  </div>
                  <h3 className="text-base font-black uppercase tracking-wide leading-tight mb-3">
                    Quick Tips
                  </h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/60 mt-1.5 shrink-0"></div>
                      <p className="text-emerald-100 text-sm font-medium leading-relaxed">
                        Accurate client data ensures professional invoices
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/60 mt-1.5 shrink-0"></div>
                      <p className="text-emerald-100 text-sm font-medium leading-relaxed">
                        All fields except name are optional
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/60 mt-1.5 shrink-0"></div>
                      <p className="text-emerald-100 text-sm font-medium leading-relaxed">
                        Valid email enables automatic payment reminders
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Grid3x3 size={18} className="text-emerald-600" />
                  <h4 className="text-sm font-bold text-gray-900">
                    Client Management
                  </h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Keep your client information up to date for seamless billing
                  and communication.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <ClientTable
            clients={filteredClients}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Clients;
