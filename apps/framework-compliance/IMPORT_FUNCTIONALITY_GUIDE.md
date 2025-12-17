# 📥 Data Import Functionality Guide

## Overview

The CyberCorrect platform now includes comprehensive **import functionality** for all major compliance tools. Users can import data from **CSV** and **JSON** files to quickly populate tools with existing data.

---

## 🎯 Features

### ✅ File Format Support
- **CSV Files** (.csv) - Spreadsheet-compatible format
- **JSON Files** (.json) - Structured data format
- **Drag & Drop** - Simple file upload interface
- **File Validation** - Automatic format and size checking (max 10MB)

### ✅ Data Validation
- **Required Fields** - Ensures critical data is present
- **Format Validation** - Email, date, number format checking
- **Schema Validation** - Type checking for all fields
- **Error Reporting** - Clear feedback on validation issues

### ✅ Import Features
- **Bulk Import** - Import up to 500 records at once
- **Duplicate Detection** - Prevents duplicate entries by ID
- **Data Transformation** - Automatic snake_case to camelCase conversion
- **Progress Feedback** - Real-time import status updates

---

## 🛠️ Tools with Import Support

### ✅ Implemented (3 tools)
1. **Vendor Risk Assessment** - Import vendor compliance data
2. **Privacy Rights Manager** - Import data subject access requests
3. **Service Provider Manager** - Import service provider records *(in progress)*

### 📋 Planned (5+ tools)
4. GDPR Mapper - Import processing activities
5. DPIA Manager - Import impact assessments
6. Consent Management - Import consent records
7. Incident Response Manager - Import privacy incidents
8. Retention Policy Generator - Import retention policies
9. Privacy By Design Assessment - Import PbD assessments
10. Privacy Settings Audit - Import audit configurations

---

## 📖 How to Use Import

### Step 1: Prepare Your Data

#### CSV Format Example:
```csv
vendorName,serviceDescription,riskLevel,complianceStatus,assessmentScore
Acme Corp,Cloud Hosting,medium,compliant,85
DataPro Inc,Analytics Platform,high,review_needed,62
SecureVault,Data Storage,low,compliant,92
```

#### JSON Format Example:
```json
[
  {
    "vendorName": "Acme Corp",
    "serviceDescription": "Cloud Hosting",
    "riskLevel": "medium",
    "complianceStatus": "compliant",
    "assessmentScore": 85
  },
  {
    "vendorName": "DataPro Inc",
    "serviceDescription": "Analytics Platform",
    "riskLevel": "high",
    "complianceStatus": "review_needed",
    "assessmentScore": 62
  }
]
```

### Step 2: Access Import Dialog

1. Navigate to the tool (e.g., Vendor Risk Assessment)
2. Click the **"Upload"** or **"Import"** button (📤 icon)
3. Select **CSV** or **JSON** tab in the dialog

### Step 3: Upload File

- **Drag & Drop**: Drag file into the upload area
- **Browse**: Click to select file from your computer
- File is automatically validated and parsed

### Step 4: Review Results

The import dialog shows:
- ✅ **Valid Records** - Count of records ready to import
- ❌ **Invalid Records** - Count of records with errors
- ⚠️ **Warnings** - Non-critical issues found
- 📊 **Error Details** - Specific validation failures

### Step 5: Confirm Import

- Review the summary statistics
- Click **"Import Data"** to proceed
- Records are added to the tool
- Duplicates are automatically filtered

---

## 📋 Field Requirements by Tool

### Vendor Risk Assessment

#### Required Fields:
- `vendorName` (string) - Name of the vendor

#### Optional Fields:
- `id` (string) - Unique identifier (auto-generated if not provided)
- `serviceDescription` (string) - Description of services
- `riskLevel` (string) - One of: `low`, `medium`, `high`, `critical`
- `complianceStatus` (string) - One of: `compliant`, `review_needed`, `non_compliant`
- `assessmentScore` (number) - Score from 0-100
- `contractStartDate` (string) - ISO date format (YYYY-MM-DD)
- `contractEndDate` (string) - ISO date format
- `lastAssessmentDate` (string) - ISO date format
- `nextAssessmentDue` (string) - ISO date format
- `dataTypesProcessed` (array) - List of data types
- `applicableRegulations` (array) - List of regulations
- `securityCertifications` (array) - List of certifications
- `privacyPolicyReviewed` (boolean) - true/false
- `dpaSigned` (boolean) - true/false
- `employeeDataAccess` (boolean) - true/false

### Privacy Rights Manager (DSAR)

#### Required Fields:
- `requesterName` (string) - Name of data subject
- `requesterEmail` (string) - Valid email address

#### Optional Fields:
- `id` (string) - Unique identifier
- `requestType` (string) - One of: `access`, `rectification`, `erasure`, `portability`, `restriction`, `objection`
- `description` (string) - Request details
- `requestDate` (string) - ISO date format
- `deadline` (string) - ISO date format (auto-calculated if not provided)
- `status` (string) - One of: `pending`, `in_progress`, `completed`, `rejected`
- `priority` (string) - One of: `low`, `medium`, `high`
- `assignedTo` (string) - Responsible person
- `notes` (string) - Additional notes

---

## 🔒 Data Privacy & Security

### Privacy by Design
- **Local Storage First** - All data stored locally by default
- **No Auto-Upload** - Cloud sync is optional and opt-in
- **User Control** - Users decide what data to import
- **Data Validation** - Prevents malformed or malicious data

### Security Features
- **File Size Limits** - Maximum 10MB per file
- **Format Validation** - Only CSV and JSON accepted
- **Schema Enforcement** - Required fields must be present
- **Sanitization** - Data is validated and sanitized on import

---

## ❌ Common Import Errors

### Error: "Missing required headers"
**Cause:** CSV file doesn't include required column headers  
**Solution:** Ensure CSV has all required headers in the first row

### Error: "Invalid file type"
**Cause:** File is not .csv or .json  
**Solution:** Convert file to CSV or JSON format

### Error: "File too large"
**Cause:** File exceeds 10MB limit  
**Solution:** Split data into multiple smaller files

### Error: "JSON parsing failed"
**Cause:** Invalid JSON syntax  
**Solution:** Validate JSON using a JSON validator tool

### Error: "Row X: Missing required field: [fieldName]"
**Cause:** Required field is empty in that row  
**Solution:** Fill in the required field or remove the row

### Error: "Invalid value for field: [fieldName]"
**Cause:** Value doesn't match expected format (e.g., text in number field)  
**Solution:** Correct the value to match the expected type

---

## 💡 Best Practices

### 1. **Data Preparation**
- Clean your data before import
- Use consistent date formats (YYYY-MM-DD)
- Remove special characters from text fields
- Validate email addresses

### 2. **Small Batches**
- Import in batches of 100-500 records
- Test with a small sample first
- Review results before importing large datasets

### 3. **Backup First**
- Export existing data before importing
- Keep original files for reference
- Test import in a separate environment if possible

### 4. **Error Handling**
- Review error messages carefully
- Fix errors in source file and re-import
- Don't ignore warnings - they indicate data quality issues

### 5. **Data Quality**
- Ensure unique IDs for each record
- Use standardized values for enums (e.g., "high" not "HIGH")
- Include all required fields
- Validate data externally before import

---

## 🔧 Technical Implementation

### For Developers

#### Adding Import to a New Tool

1. **Import Required Components:**
```typescript
import { ImportDialog } from '../../components/ui/ImportDialog';
import { validators } from '../../utils/import/jsonValidator';
import { Upload } from 'lucide-react';
```

2. **Add State:**
```typescript
const [showImportDialog, setShowImportDialog] = useState(false);
```

3. **Create Import Handler:**
```typescript
const handleImportData = async (importedData: Partial<YourDataType>[]) => {
  try {
    // Transform and validate data
    const newRecords = importedData.map((item, index) => ({
      id: item.id || `PREFIX-${Date.now()}-${index}`,
      // ... map other fields with defaults
    }));

    // Save to storage
    saveRecords([...existingRecords, ...newRecords]);

    toast.success('Import Successful', `Imported ${newRecords.length} record(s)`);
  } catch (error) {
    throw new Error('Failed to import data');
  }
};
```

4. **Add Import Button:**
```tsx
<Button variant="outline" onClick={() => setShowImportDialog(true)}>
  <Upload className="h-4 w-4 mr-2" />
  Import
</Button>
```

5. **Add Import Dialog:**
```tsx
<ImportDialog<YourDataType>
  open={showImportDialog}
  onClose={() => setShowImportDialog(false)}
  onImport={handleImportData}
  title="Import [Tool Name]"
  description="Upload CSV or JSON file"
  csvHeaders={['field1', 'field2', 'field3']}
  jsonValidation={{
    required: ['field1'],
    schema: {
      field1: validators.isString,
      field2: validators.isNumber,
    },
  }}
  maxRecords={500}
/>
```

#### Available Validators

```typescript
validators.isString      // Check if string
validators.isNumber      // Check if number
validators.isBoolean     // Check if boolean
validators.isArray       // Check if array
validators.isEmail       // Check if valid email
validators.isDate        // Check if valid date string
validators.isURL         // Check if valid URL
validators.oneOf([...])  // Check if value is in list
validators.minLength(n)  // Check minimum string length
validators.maxLength(n)  // Check maximum string length
```

---

## 📊 Export Integration

All tools with import functionality also support **export** in multiple formats:

- **JSON Export** - Full data structure
- **CSV Export** - Spreadsheet-compatible
- **PDF Export** - Formatted reports

This creates a complete **import/export workflow** for data portability.

---

## 🎓 Training Resources

### Video Tutorials (Coming Soon)
- How to Import Vendor Assessments
- Bulk Import Data Subject Requests
- Troubleshooting Import Errors

### Sample Files
Check the `/examples` folder for sample CSV and JSON files for each tool.

---

## 🆘 Support

### Need Help?
- **Documentation**: Read the field requirements for your tool
- **Chatbot**: Use the in-app guide bot for assistance
- **Support**: Contact privacy@cybercorrect.com

### Report Issues
- **Bug Reports**: Use the feedback form in the app
- **Feature Requests**: Suggest improvements via support

---

## 📈 Roadmap

### Phase 1: Core Tools (✅ Completed)
- ✅ Vendor Risk Assessment
- ✅ Privacy Rights Manager
- ✅ Service Provider Manager

### Phase 2: Assessment Tools (Q1 2025)
- 📋 GDPR Mapper
- 📋 DPIA Manager
- 📋 Consent Management

### Phase 3: Advanced Features (Q2 2025)
- 📋 Automated data transformation
- 📋 Import templates
- 📋 Scheduled imports
- 📋 API import endpoints

---

## 🔄 Version History

### v1.0.0 (December 2024)
- ✅ Initial release
- ✅ CSV and JSON import support
- ✅ Drag-and-drop file upload
- ✅ Data validation and error reporting
- ✅ 3 tools with full import functionality

---

**Last Updated:** December 17, 2024  
**Version:** 1.0.0  
**Author:** CyberCorrect Development Team

