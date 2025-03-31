import React, { useRef, useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Box, 
  Typography, 
  List, 
  ListItem, 
  CircularProgress,
  Tab,
  Tabs,
  TextField,
  Stack,
  Paper
} from '@mui/material';
import { 
  Printer, 
  Download, 
  Share2, 
  CalendarRange, 
  Copy, 
  FileText,
  Mail,
  Smartphone
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'react-hot-toast';
import PrintableRecipe from './PrintableRecipe';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface RecipeExportModalProps {
  open: boolean;
  onClose: () => void;
  recipe: string;
  imageUrl?: string;
  title?: string;
}

const RecipeExportModal: React.FC<RecipeExportModalProps> = ({
  open,
  onClose,
  recipe,
  imageUrl,
  title
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const printableRef = useRef<HTMLDivElement>(null);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePrint = () => {
    setLoading(true);
    
    // Simple print functionality using browser's print API
    setTimeout(() => {
      if (printableRef.current) {
        // Create a new window to print
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write('<html><head><title>Print Recipe</title>');
          printWindow.document.write('<style>body { font-family: Arial, sans-serif; padding: 20px; }</style>');
          printWindow.document.write('</head><body>');
          printWindow.document.write(printableRef.current.innerHTML);
          printWindow.document.write('</body></html>');
          printWindow.document.close();
          
          printWindow.onload = function() {
            printWindow.print();
            printWindow.onafterprint = function() {
              printWindow.close();
            };
          };
        }
      } else {
        window.print();
      }
      
      setLoading(false);
      toast.success('Recipe printed successfully!');
    }, 500);
  };

  const downloadAsPDF = async () => {
    if (!printableRef.current) return;
    
    setLoading(true);
    try {
      const canvas = await html2canvas(printableRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${title || 'Fusion_Meals_Recipe'}.pdf`);
      
      toast.success('Recipe downloaded as PDF!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyRecipeToClipboard = () => {
    navigator.clipboard.writeText(recipe)
      .then(() => {
        toast.success('Recipe copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy recipe. Please try again.');
      });
  };

  const shareViaEmail = () => {
    if (!emailInput) {
      toast.error('Please enter an email address');
      return;
    }
    
    // In a real implementation, this would send the recipe to the backend
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success(`Recipe shared to ${emailInput}`);
      setEmailInput('');
    }, 1500);
  };
  
  const shareViaSMS = () => {
    if (!phoneInput) {
      toast.error('Please enter a phone number');
      return;
    }
    
    // In a real implementation, this would send the recipe to the backend
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success(`Recipe shared to ${phoneInput}`);
      setPhoneInput('');
    }, 1500);
  };

  const addToCalendar = () => {
    // In a real implementation, this would integrate with calendar APIs
    toast.success('Feature coming soon: Add recipe to your calendar');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="recipe-export-dialog-title"
    >
      <DialogTitle id="recipe-export-dialog-title">
        <Typography variant="h6" component="div">
          Export Recipe
        </Typography>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="export options tabs"
          sx={{ mt: 2 }}
        >
          <Tab icon={<Printer size={18} />} label="Print" />
          <Tab icon={<Download size={18} />} label="Download" />
          <Tab icon={<Share2 size={18} />} label="Share" />
          <Tab icon={<CalendarRange size={18} />} label="Calendar" />
        </Tabs>
      </DialogTitle>
      
      <DialogContent dividers>
        <TabPanel value={tabValue} index={0}>
          <Typography variant="body1" paragraph>
            Print this recipe to keep a physical copy for your kitchen.
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Printer size={18} />}
            onClick={handlePrint}
            disabled={loading}
            fullWidth
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Print Recipe'}
          </Button>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Typography variant="body1" paragraph>
            Download this recipe to keep and share offline.
          </Typography>
          <List>
            <ListItem disablePadding>
              <Button 
                fullWidth 
                startIcon={<FileText size={18} />} 
                onClick={downloadAsPDF}
                disabled={loading}
                variant="outlined"
                sx={{ justifyContent: "flex-start", py: 1, my: 1 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Download as PDF'}
              </Button>
            </ListItem>
            <ListItem disablePadding>
              <Button 
                fullWidth 
                startIcon={<Copy size={18} />} 
                onClick={copyRecipeToClipboard}
                variant="outlined"
                sx={{ justifyContent: "flex-start", py: 1, my: 1 }}
              >
                Copy Text to Clipboard
              </Button>
            </ListItem>
          </List>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Typography variant="body1" paragraph>
            Share this recipe with friends and family.
          </Typography>
          
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Share via Email
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField 
                fullWidth
                placeholder="Enter email address"
                size="small"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
              <Button 
                variant="contained" 
                startIcon={<Mail size={18} />}
                onClick={shareViaEmail}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Send'}
              </Button>
            </Stack>
          </Paper>
          
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Share via SMS
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField 
                fullWidth
                placeholder="Enter phone number"
                size="small"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
              />
              <Button 
                variant="contained" 
                startIcon={<Smartphone size={18} />}
                onClick={shareViaSMS}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Send'}
              </Button>
            </Stack>
          </Paper>
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <Typography variant="body1" paragraph>
            Add this recipe to your meal planning calendar.
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<CalendarRange size={18} />}
            onClick={addToCalendar}
            fullWidth
            sx={{ mt: 2 }}
          >
            Add to Calendar
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This feature allows you to schedule this recipe in your meal plan.
            You can also set reminders for preparation and cooking times.
          </Typography>
        </TabPanel>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
      
      {/* Hidden printable content */}
      <Box sx={{ display: 'none' }}>
        <Box ref={printableRef}>
          <PrintableRecipe 
            recipe={recipe}
            imageUrl={imageUrl}
            title={title}
          />
        </Box>
      </Box>
    </Dialog>
  );
};

export default RecipeExportModal; 