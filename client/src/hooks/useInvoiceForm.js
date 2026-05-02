import { useState, useEffect } from 'react';
import { clientService, templateService, productService } from '../services/api';
import { useInvoiceCalculator } from './useInvoiceCalculator';
import toast from 'react-hot-toast';

export const useInvoiceForm = (initialData = null) => {
  const [clients, setClients] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [products, setProducts] = useState([]);
  
  // Form State
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState('Monthly');
  const [recurringIntervalValue, setRecurringIntervalValue] = useState(1);
  const [nextRecurrenceDate, setNextRecurrenceDate] = useState('');
  const [recurringEndType, setRecurringEndType] = useState('Never');
  const [recurringEndDate, setRecurringEndDate] = useState('');
  const [recurringEndCount, setRecurringEndCount] = useState(0);

  const [notes, setNotes] = useState('');
  const [termsAndConditions, setTermsAndConditions] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('+91 90111-85021');
  const [signatureUrl, setSignatureUrl] = useState('');
  const [attachments, setAttachments] = useState([]);
  
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  // Fetch prerequisites
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, templatesRes, productsRes] = await Promise.all([
          clientService.getAll(),
          templateService.getAll(),
          productService.getAll()
        ]);
        setClients(clientsRes.data);
        setTemplates(templatesRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error('Error fetching prerequisites:', error);
      }
    };
    fetchData();
  }, []);

  // Initialize with initialData if provided (for Edit mode)
  useEffect(() => {
    if (initialData) {
      // Use queueMicrotask to avoid synchronous setState in effect
      queueMicrotask(() => {
        setSelectedClientId(initialData.clientId || '');
        setSelectedTemplateId(initialData.templateId || '');
        setIssueDate(initialData.issueDate || '');
        setDueDate(initialData.dueDate || '');
        setIsRecurring(initialData.isRecurring || false);
        setRecurringInterval(initialData.recurringInterval || 'Monthly');
        setRecurringIntervalValue(initialData.recurringIntervalValue || 1);
        setNextRecurrenceDate(initialData.nextRecurrenceDate ? new Date(initialData.nextRecurrenceDate).toISOString().slice(0, 16) : '');
        setRecurringEndType(initialData.recurringEndType || 'Never');
        setRecurringEndDate(initialData.recurringEndDate || '');
        setRecurringEndCount(initialData.recurringEndCount || 0);
        setNotes(initialData.notes || '');
        setTermsAndConditions(initialData.termsAndConditions || '');
        setAdditionalInfo(initialData.additionalInfo || '');
        setContactEmail(initialData.contactEmail || '');
        setContactPhone(initialData.contactPhone || '+91 90111-85021');
        setSignatureUrl(initialData.signatureUrl || '');
        setAttachments(initialData.attachments || []);
        setItems(initialData.items || []);
      });
    }
  }, [initialData]);

  const { subtotal, taxTotal, grandTotal } = useInvoiceCalculator(items);

  const handleAddProduct = (productId) => {
    if (!productId) return;
    const product = products.find(p => p.id === parseInt(productId));
    if (!product) return;

    const existingIndex = items.findIndex(item => item.productId === product.id);
    if (existingIndex > -1) {
      const newItems = [...items];
      const item = newItems[existingIndex];
      const newQty = item.quantity + 1;
      newItems[existingIndex] = { 
        ...item, 
        quantity: newQty, 
        total: newQty * item.unitPrice * (1 + item.taxRate / 100) 
      };
      setItems(newItems);
      toast.success(`Incremented quantity of ${product.name}`);
    } else {
      setItems([...items, { 
        id: Date.now(),
        productId: product.id, 
        name: product.name, 
        quantity: 1, 
        unitPrice: parseFloat(product.unitPrice), 
        taxRate: parseFloat(product.taxRate),
        total: parseFloat(product.unitPrice) * (1 + parseFloat(product.taxRate) / 100)
      }]);
    }
  };

  const updateItemQuantity = (id, quantity) => {
    setItems(items.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const removeItem = (id) => setItems(items.filter(item => item.id !== id));

  const validate = () => {
    if (!selectedClientId) return 'Please select a client.';
    if (!selectedTemplateId) return 'Please select a template.';
    if (items.length === 0) return 'Add at least one item.';
    for (const item of items) {
      if (item.quantity <= 0) return 'Quantities must be > 0.';
      if (item.unitPrice <= 0) return 'Prices must be > 0.';
    }
    return null;
  };

  const getPayload = () => ({
    clientId: parseInt(selectedClientId, 10),
    templateId: parseInt(selectedTemplateId, 10),
    issueDate,
    dueDate: dueDate || undefined,
    isRecurring,
    recurringInterval: isRecurring ? recurringInterval : undefined,
    recurringIntervalValue: isRecurring ? parseInt(recurringIntervalValue) : undefined,
    nextRecurrenceDate: isRecurring ? nextRecurrenceDate : undefined,
    recurringEndType: isRecurring ? recurringEndType : undefined,
    recurringEndDate: (isRecurring && recurringEndType === 'Date') ? recurringEndDate : undefined,
    recurringEndCount: (isRecurring && recurringEndType === 'Count') ? parseInt(recurringEndCount) : undefined,
    notes,
    termsAndConditions,
    additionalInfo,
    contactEmail,
    contactPhone,
    signatureUrl,
    attachments,
    items: items.map(({ productId, name, quantity, unitPrice, taxRate }) => ({ productId, name, quantity, unitPrice, taxRate }))
  });

  useEffect(() => {
    if (isRecurring && !nextRecurrenceDate) {
      const date = new Date(issueDate);
      if (recurringInterval === 'Daily') date.setDate(date.getDate() + (parseInt(recurringIntervalValue) || 1));
      else if (recurringInterval === 'Weekly') date.setDate(date.getDate() + 7 * (parseInt(recurringIntervalValue) || 1));
      else if (recurringInterval === 'Monthly') date.setMonth(date.getMonth() + (parseInt(recurringIntervalValue) || 1));
      else if (recurringInterval === 'Yearly') date.setFullYear(date.getFullYear() + (parseInt(recurringIntervalValue) || 1));
      
      setNextRecurrenceDate(date.toISOString().slice(0, 16));
    }
  }, [isRecurring, issueDate, recurringInterval, recurringIntervalValue]);

  const selectedTemplate = templates.find(t => t.id === parseInt(selectedTemplateId));

  return {
    clients, templates, products,
    selectedClientId, setSelectedClientId,
    selectedTemplateId, setSelectedTemplateId,
    selectedTemplate,
    issueDate, setIssueDate,
    dueDate, setDueDate,
    isRecurring, setIsRecurring,
    recurringInterval, setRecurringInterval,
    recurringIntervalValue, setRecurringIntervalValue,
    nextRecurrenceDate, setNextRecurrenceDate,
    recurringEndType, setRecurringEndType,
    recurringEndDate, setRecurringEndDate,
    recurringEndCount, setRecurringEndCount,
    notes, setNotes,
    termsAndConditions, setTermsAndConditions,
    additionalInfo, setAdditionalInfo,
    contactEmail, setContactEmail,
    contactPhone, setContactPhone,
    signatureUrl, setSignatureUrl,
    attachments, setAttachments,
    items, setItems,
    error, setError,
    subtotal, taxTotal, grandTotal,
    handleAddProduct, updateItemQuantity, removeItem,
    validate, getPayload
  };
};
