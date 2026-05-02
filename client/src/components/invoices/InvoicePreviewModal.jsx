import { PDFViewer } from "@react-pdf/renderer";
import { X } from "lucide-react";
import InvoicePDF from "../../pdf/InvoicePDF";

const InvoicePreviewModal = ({
  show,
  onClose,
  invoiceData,
  client,
  company,
  templateName,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full h-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 border-2 border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 bg-gradient-to-r from-emerald-50 to-amber-50 border-b-2 border-gray-100">
          <div>
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">
              Live Document Preview
            </h3>
            <p className="text-xs text-gray-400 font-bold mt-0.5">
              Template: {templateName || "Default"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-xl transition-colors border-2 border-transparent hover:border-gray-200"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 bg-gray-100 p-4 md:p-8 overflow-auto">
          <div className="w-full h-full min-h-[600px] bg-white shadow-lg rounded-2xl overflow-hidden">
            <PDFViewer className="w-full h-full border-none">
              <InvoicePDF
                invoice={invoiceData}
                client={client}
                company={company}
              />
            </PDFViewer>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t-2 border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreviewModal;
