import {
  Trash2,
  Edit2,
  MapPin,
  Mail,
  Phone,
  Users,
  Building2,
} from "lucide-react";
import EmptyState from "../ui/EmptyState";

const ClientTable = ({ clients, onEdit, onDelete }) => {
  if (clients.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100">
        <EmptyState
          icon={Users}
          title="No clients found"
          description="Try adjusting your search or add a new client to get started."
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
      {/* Table Header — matches ProductTable header */}
      <div className="px-8 py-5 bg-gradient-to-r from-emerald-50/50 to-amber-50/50 border-b-2 border-gray-100">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
              Client Information
            </h3>
          </div>
          <div className="col-span-5">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
              Contact Details
            </h3>
          </div>
          <div className="col-span-3 text-right">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
              Actions
            </h3>
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-100">
        {clients.map((client) => (
          <div
            key={client.id}
            className="group hover:bg-gradient-to-r hover:from-emerald-50/30 hover:to-amber-50/30 transition-all duration-200"
          >
            <div className="px-8 py-5 grid grid-cols-12 gap-4 items-center">
              {/* Client Name & Address */}
              <div className="col-span-4 flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all shrink-0">
                  <Building2 size={20} className="text-emerald-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-gray-900 text-base truncate group-hover:text-emerald-700 transition-colors">
                    {client.name}
                  </h4>
                  {client.address && (
                    <div className="flex items-start gap-1.5 mt-2 text-gray-500 text-xs font-medium">
                      <MapPin
                        size={13}
                        className="shrink-0 text-emerald-500 mt-0.5"
                      />
                      <span className="line-clamp-2">{client.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Details */}
              <div className="col-span-5 space-y-2">
                {client.email ? (
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-emerald-50 rounded-lg">
                      <Mail size={14} className="text-emerald-600" />
                    </div>
                    <span className="text-gray-700 text-sm font-medium truncate">
                      {client.email}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-gray-50 rounded-lg">
                      <Mail size={14} className="text-gray-300" />
                    </div>
                    <span className="text-gray-400 text-xs font-medium italic">
                      No email
                    </span>
                  </div>
                )}

                {client.phone ? (
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-emerald-50 rounded-lg">
                      <Phone size={14} className="text-emerald-600" />
                    </div>
                    <span className="text-gray-700 text-sm font-medium">
                      {client.phone}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-gray-50 rounded-lg">
                      <Phone size={14} className="text-gray-300" />
                    </div>
                    <span className="text-gray-400 text-xs font-medium italic">
                      No phone
                    </span>
                  </div>
                )}
              </div>

              {/* Actions — always visible, no overlap */}
              <div className="col-span-3 flex justify-end items-center gap-1.5">
                <button
                  onClick={() => onEdit(client)}
                  className="group/btn flex items-center gap-2 px-4 py-2.5 text-emerald-600 hover:text-white bg-emerald-50 hover:bg-emerald-600 rounded-xl transition-all font-semibold text-sm shadow-sm hover:shadow-md"
                  title="Edit client"
                >
                  <Edit2
                    size={16}
                    className="group-hover/btn:scale-110 transition-transform"
                  />
                  <span className="hidden lg:inline">Edit</span>
                </button>
                <button
                  onClick={() => onDelete(client.id)}
                  className="group/btn flex items-center gap-2 px-4 py-2.5 text-red-600 hover:text-white bg-red-50 hover:bg-red-600 rounded-xl transition-all font-semibold text-sm shadow-sm hover:shadow-md"
                  title="Delete client"
                >
                  <Trash2
                    size={16}
                    className="group-hover/btn:scale-110 transition-transform"
                  />
                  <span className="hidden lg:inline">Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer — matches ProductTable footer */}
      <div className="px-8 py-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-t-2 border-gray-100">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 font-medium">
            Showing{" "}
            <span className="font-bold text-gray-700">{clients.length}</span>{" "}
            {clients.length === 1 ? "client" : "clients"}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-xs text-gray-500 font-medium">
              Active Clients
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientTable;
