# 📁 Sample Import Files

This directory contains sample CSV and JSON files for testing the import functionality of CyberCorrect compliance tools.

## 📋 Available Sample Files

### Vendor Risk Assessment
- **CSV:** `vendor-risk-assessment-sample.csv`
- **JSON:** `vendor-risk-assessment-sample.json`
- **Records:** 10 sample vendors with compliance data

### Privacy Rights Manager (Data Subject Requests)
- **CSV:** `privacy-rights-requests-sample.csv`
- **JSON:** `privacy-rights-requests-sample.json`
- **Records:** 8 sample data subject access requests

### GDPR Mapper (Processing Activities)
- **CSV:** `gdpr-processing-activities-sample.csv`
- **JSON:** `gdpr-processing-activities-sample.json`
- **Records:** 8 sample Article 30 records

## 🚀 How to Use

### 1. Download Sample File
- Choose either CSV or JSON format
- Save to your computer

### 2. Open Import Dialog
- Navigate to the relevant tool in CyberCorrect
- Click the **"Import"** button (📤 icon)

### 3. Upload File
- Select the CSV or JSON tab
- Drag & drop or browse to select the sample file
- Review validation results

### 4. Import Data
- Check that all records are valid
- Click **"Import Data"** to add to your tool

## 📝 Customizing Sample Data

### CSV Format
- Open in Excel, Google Sheets, or any spreadsheet app
- Modify values as needed
- Keep headers unchanged
- Save as CSV

### JSON Format
- Open in any text editor
- Modify values within the JSON structure
- Ensure valid JSON syntax
- Save as .json file

## 🔍 Field Descriptions

### Vendor Risk Assessment Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `vendorName` | string | ✅ Yes | Name of the vendor |
| `serviceDescription` | string | No | Description of services provided |
| `riskLevel` | enum | No | `low`, `medium`, `high`, `critical` |
| `complianceStatus` | enum | No | `compliant`, `review_needed`, `non_compliant` |
| `assessmentScore` | number | No | 0-100 score |
| `dataTypesProcessed` | array/string | No | Comma-separated in CSV, array in JSON |
| `privacyPolicyReviewed` | boolean | No | `true` or `false` |
| `dpaSigned` | boolean | No | `true` or `false` |

### Privacy Rights Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `requesterName` | string | ✅ Yes | Name of data subject |
| `requesterEmail` | string | ✅ Yes | Valid email address |
| `requestType` | enum | No | `access`, `erasure`, `rectification`, `portability`, `restriction`, `objection` |
| `description` | string | No | Request details |
| `requestDate` | date | No | ISO format (YYYY-MM-DD) |
| `priority` | enum | No | `low`, `medium`, `high` |
| `status` | enum | No | `pending`, `in_progress`, `completed`, `rejected` |

### GDPR Processing Activity Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ Yes | Name of processing activity |
| `purpose` | string | ✅ Yes | Purpose of processing |
| `legalBasis` | enum | ✅ Yes | `consent`, `contract`, `legal_obligation`, `vital_interests`, `public_task`, `legitimate_interests` |
| `dataTypes` | array/string | No | Types of data processed |
| `dataSubjects` | array/string | No | Categories of data subjects |
| `recipients` | array/string | No | Who receives the data |
| `retentionPeriod` | string | No | How long data is kept |
| `riskLevel` | enum | No | `low`, `medium`, `high`, `critical` |
| `dpiaRequired` | boolean | No | Is DPIA required? |
| `internationalTransfer` | boolean | No | Data transferred internationally? |

## ⚠️ Important Notes

### Array Fields in CSV
Arrays must be comma-separated strings in CSV:
```csv
dataTypes,dataSubjects
"Names,Emails,Phone numbers","Customers,Prospects"
```

### Array Fields in JSON
Arrays use proper JSON array syntax:
```json
{
  "dataTypes": ["Names", "Emails", "Phone numbers"],
  "dataSubjects": ["Customers", "Prospects"]
}
```

### Boolean Values
- **CSV:** Use `true` or `false` (lowercase)
- **JSON:** Use proper JSON booleans: `true` or `false`

### Date Format
Always use ISO format: `YYYY-MM-DD`
- ✅ Correct: `2024-12-17`
- ❌ Wrong: `12/17/2024` or `17-12-2024`

## 🎓 Learning Resources

- **Import Guide:** See `/IMPORT_FUNCTIONALITY_GUIDE.md` for detailed instructions
- **Video Tutorial:** Coming soon
- **In-App Help:** Use the chatbot guide for assistance

## 🔄 Creating Your Own Import Files

### From Excel/Google Sheets
1. Create spreadsheet with required headers
2. Fill in your data
3. File → Save As → CSV format
4. Import into CyberCorrect

### From Database Export
1. Export data as CSV or JSON
2. Map your fields to required headers
3. Validate data format
4. Import into CyberCorrect

### From API Response
1. Fetch data from your API
2. Transform to match required schema
3. Save as JSON file
4. Import into CyberCorrect

## 🛠️ Troubleshooting

### Import Fails with "Invalid Headers"
- **Solution:** Ensure CSV headers exactly match required field names
- **Check:** First row contains header names, not data

### Import Shows Many Validation Errors
- **Solution:** Review error messages for specific issues
- **Common Issues:** Wrong date format, invalid enum values, missing required fields

### Some Records Import, Others Don't
- **Solution:** Check warnings/errors for specific row numbers
- **Fix:** Correct invalid records in source file and re-import

### JSON Parse Error
- **Solution:** Validate JSON syntax using jsonlint.com
- **Common Issues:** Missing commas, unclosed brackets, trailing commas

## 📞 Support

Need help with import files?
- 📧 Email: support@cybercorrect.com
- 💬 In-App: Use chatbot guide
- 📖 Docs: See IMPORT_FUNCTIONALITY_GUIDE.md

---

**Sample Data Notice:** These sample files contain fictional data for testing purposes only. Do not use in production without replacing with your actual data.

**Last Updated:** December 17, 2024

