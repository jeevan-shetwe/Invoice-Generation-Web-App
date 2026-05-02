import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const createStyles = (branding) => StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: branding.textColor || '#1f2937',
    backgroundColor: '#ffffff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
    objectFit: 'contain',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: branding.primaryColor || '#4f46e5',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  companyInfo: {
    textAlign: 'right',
    fontSize: 9,
    color: '#6b7280',
    lineHeight: 1.4,
  },
  section: {
    marginBottom: 25,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
    paddingVertical: 10,
    alignItems: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    padding: 8,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  totalsText: {
    width: 100,
    textAlign: 'right',
    fontSize: 10,
  },
  grandTotal: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    color: branding.primaryColor || '#4f46e5',
  },
  bold: {
    fontWeight: 'bold',
  }
});

const InvoicePDF = ({ invoice, client, company }) => {
  const branding = invoice.templateSnapshot?.branding || {};
  const fields = invoice.templateSnapshot?.fields || {};
  const styles = createStyles(branding);

  const currencyMap = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'INR': '₹',
    'CAD': 'C$',
    'AUD': 'A$',
    'JPY': '¥',
    'CNY': '¥'
  };

  const symbol = currencyMap[invoice.currency || company?.currency] || '$';

  const getFullUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    // Ensure we point to the backend server (Port 5000) not the frontend (Port 5173)
    const backendBase = 'http://localhost:5000';
    return backendBase + url;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            {/* Priority: 1. User Logo (company), 2. Template Logo (branding), 3. Company Name */}
            {(company?.logoUrl || branding?.logoUrl) ? (
              <Image src={getFullUrl(company?.logoUrl || branding?.logoUrl)} style={styles.logo} />
            ) : (
              <Text style={styles.title}>{company?.companyName || 'INVOICE'}</Text>
            )}
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 10 }}>#{invoice.invoiceNumber}</Text>
          </View>
          
          <View style={styles.companyInfo}>
            <Text style={[styles.bold, { color: '#111827', fontSize: 11, marginBottom: 4 }]}>
              {company?.companyName || 'My Company'}
            </Text>
            {company?.address && <Text>{company.address}</Text>}
            {company?.email && <Text>{company.email}</Text>}
            {company?.phone && <Text>{company.phone}</Text>}
            {company?.website && <Text>{company.website}</Text>}
          </View>
        </View>

        {/* Dates Section */}
        <View style={[styles.section, { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fdfdfd', padding: 15, borderRadius: 4, border: '1px solid #f3f4f6' }]}>
          <View>
            <Text style={[styles.bold, { color: '#6b7280', fontSize: 8, textTransform: 'uppercase', marginBottom: 4 }]}>Bill To</Text>
            <Text style={[styles.bold, { fontSize: 12 }]}>{client?.name || 'Client Name'}</Text>
            <Text style={{ marginTop: 2 }}>{client?.address}</Text>
            <Text>{client?.email}</Text>
          </View>
          <View style={{ textAlign: 'right' }}>
            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: '#6b7280', fontSize: 8, textTransform: 'uppercase' }}>Issued Date</Text>
              <Text style={styles.bold}>{invoice.issueDate}</Text>
            </View>
            <View>
              <Text style={{ color: '#6b7280', fontSize: 8, textTransform: 'uppercase' }}>Due Date</Text>
              <Text style={[styles.bold, { color: '#ef4444' }]}>{invoice.dueDate}</Text>
            </View>
          </View>
        </View>

        {/* Table */}
        <View style={styles.section}>
          <View style={styles.tableHeader}>
            <Text style={{ flex: 3 }}>Item Description</Text>
            <Text style={{ flex: 1, textAlign: 'center' }}>Qty</Text>
            <Text style={{ flex: 1, textAlign: 'right' }}>Price</Text>
            <Text style={{ flex: 1, textAlign: 'right' }}>Amount</Text>
          </View>
          
          {invoice.items.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={{ flex: 3, fontWeight: 'bold' }}>{item.name}</Text>
              <Text style={{ flex: 1, textAlign: 'center' }}>{item.quantity}</Text>
              <Text style={{ flex: 1, textAlign: 'right' }}>{symbol}{parseFloat(item.unitPrice).toFixed(2)}</Text>
              <Text style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>{symbol}{parseFloat(item.total).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <View style={{ width: 200 }}>
            <View style={styles.totalsRow}>
              <Text style={[styles.totalsText, { color: '#6b7280' }]}>Subtotal</Text>
              <Text style={[styles.totalsText, styles.bold]}>{symbol}{parseFloat(invoice.subtotal).toFixed(2)}</Text>
            </View>
            
            {fields.showTax !== false && (
              <View style={styles.totalsRow}>
                <Text style={[styles.totalsText, { color: '#6b7280' }]}>Tax Total</Text>
                <Text style={[styles.totalsText, styles.bold]}>{symbol}{parseFloat(invoice.taxTotal).toFixed(2)}</Text>
              </View>
            )}

            <View style={[styles.totalsRow, styles.grandTotal]}>
              <Text style={[styles.totalsText, styles.bold, { fontSize: 12 }]}>Total Amount</Text>
              <Text style={[styles.totalsText, styles.bold, { fontSize: 14 }]}>{symbol}{parseFloat(invoice.grandTotal).toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Additional Info & Recurring Details */}
        <View style={{ marginTop: 20, flexDirection: 'row', gap: 20 }}>
          {invoice.additionalInfo && (
            <View style={{ flex: 1 }}>
              <Text style={[styles.bold, { fontSize: 8, color: '#6b7280', textTransform: 'uppercase', marginBottom: 4 }]}>Additional Info</Text>
              <Text style={{ fontSize: 8, color: '#4b5563', lineHeight: 1.4 }}>{invoice.additionalInfo}</Text>
            </View>
          )}
          {invoice.isRecurring && (
            <View style={{ flex: 1, backgroundColor: '#f9fafb', padding: 8, borderRadius: 4 }}>
              <Text style={[styles.bold, { fontSize: 8, color: '#4f46e5', textTransform: 'uppercase', marginBottom: 4 }]}>Recurring Schedule</Text>
              <Text style={{ fontSize: 8, color: '#4b5563' }}>Repeats: {invoice.recurringIntervalValue} {invoice.recurringInterval}(s)</Text>
              <Text style={{ fontSize: 8, color: '#4b5563', marginTop: 2 }}>
                Next Date: {(invoice.nextRecurrenceDate && !isNaN(new Date(invoice.nextRecurrenceDate).getTime())) 
                  ? new Date(invoice.nextRecurrenceDate).toLocaleDateString() 
                  : 'Not scheduled'}
              </Text>
              <Text style={{ fontSize: 8, color: '#4b5563', marginTop: 2 }}>
                Ends: {invoice.recurringEndType === 'Never' ? 'Never' : 
                       invoice.recurringEndType === 'Date' ? `On ${invoice.recurringEndDate}` : 
                       `After ${invoice.recurringEndCount} invoices`}
              </Text>
            </View>
          )}
        </View>

        {/* Custom Fields */}
        {fields.customFields?.length > 0 && (
          <View style={{ marginTop: 20, borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 10 }}>
            {fields.customFields.map((f, i) => (
              f.label && f.value && (
                <View key={i} style={{ flexDirection: 'row', marginBottom: 4 }}>
                  <Text style={[styles.bold, { fontSize: 8, width: 100, color: '#6b7280' }]}>{f.label}:</Text>
                  <Text style={{ fontSize: 8, color: '#111827' }}>{f.value}</Text>
                </View>
              )
            ))}
          </View>
        )}

        {/* Terms and Conditions */}
        {invoice.termsAndConditions && (
          <View style={{ marginTop: 20 }}>
            <Text style={[styles.bold, { fontSize: 8, color: '#6b7280', textTransform: 'uppercase', marginBottom: 4 }]}>Terms & Conditions</Text>
            <Text style={{ fontSize: 8, color: '#4b5563', lineHeight: 1.4 }}>{invoice.termsAndConditions}</Text>
          </View>
        )}

        {/* Notes */}
        {(fields.notesLabel || invoice.notes) && (
          <View style={{ marginTop: 20, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f3f4f6' }}>
            <Text style={[styles.bold, { fontSize: 9, color: '#6b7280', textTransform: 'uppercase', marginBottom: 5 }]}>
              {fields.notesLabel || 'Notes'}
            </Text>
            <Text style={{ fontSize: 9, color: '#4b5563', lineHeight: 1.5 }}>
              {invoice.notes || branding.defaultNotes || 'Thank you for your business.'}
            </Text>
          </View>
        )}

        {/* Signature & Enquiry */}
        <View style={{ marginTop: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.bold, { fontSize: 8, color: '#6b7280', textTransform: 'uppercase', marginBottom: 4 }]}>For any enquiry, reach out via</Text>
            {invoice.contactEmail && <Text style={{ fontSize: 8, color: '#4b5563' }}>Email: {invoice.contactEmail}</Text>}
            {invoice.contactPhone && <Text style={{ fontSize: 8, color: '#4b5563', marginTop: 2 }}>Call: {invoice.contactPhone}</Text>}
          </View>
          
          {invoice.signatureUrl && (
            <View style={{ alignItems: 'center' }}>
              <Image src={getFullUrl(invoice.signatureUrl)} style={{ width: 100, height: 40, objectFit: 'contain' }} />
              <View style={{ width: 120, borderTopWidth: 1, borderTopColor: '#e5e7eb', marginTop: 5, paddingTop: 5 }}>
                <Text style={{ textAlign: 'center', fontSize: 8, color: '#9ca3af', textTransform: 'uppercase' }}>Authorized Signature</Text>
              </View>
            </View>
          )}
        </View>

        <View style={{ position: 'absolute', bottom: 30, left: 40, right: 40, borderTopWidth: 1, borderTopColor: '#f9fafb', paddingTop: 10 }}>
          <Text style={{ textAlign: 'center', color: '#9ca3af', fontSize: 8 }}>
            Generated via InvoiceGen • {company?.website || ''}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
