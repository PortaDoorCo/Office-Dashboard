import React, { useState } from 'react';
import { Button, Input, Row, Col, Alert } from 'reactstrap';
import { NotificationManager } from 'react-notifications';

/**
 * CSV Dimension Uploader Component
 *
 * Allows users to upload CSV files to populate qty, width, and height fields
 * for specific part_list items in the order entry system.
 *
 * Expected CSV format:
 * qty,width,height
 * 1,24,30
 * 2,18 1/2,24 3/4
 * 1,20.5,30
 * etc.
 *
 * Supports both decimal numbers (24.5) and fractions (24 1/2, 1/2, 24-1/2)
 */
const CSVDimensionUploader = ({ fields, edit = true, partIndex, partName }) => {
  const [csvFile, setCsvFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Handle file selection
   */
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
    } else {
      NotificationManager.error(
        'Please select a valid CSV file',
        'Invalid File Type',
        3000
      );
      setCsvFile(null);
    }
  };

  /**
   * Validate if a string is a valid dimension (decimal or fraction)
   * Accepts formats like: 24, 24.5, 24 1/2, 1/2, 24-1/2
   */
  const isValidDimension = (value) => {
    if (!value || typeof value !== 'string') return false;

    const trimmed = value.trim();
    if (!trimmed) return false;

    // Check for decimal numbers (e.g., 24, 24.5)
    if (/^\d+(\.\d+)?$/.test(trimmed)) {
      const num = parseFloat(trimmed);
      return !isNaN(num) && num > 0;
    }

    // Check for fractions with whole numbers (e.g., 24 1/2, 24-1/2)
    if (/^\d+[\s-]\d+\/\d+$/.test(trimmed)) {
      const parts = trimmed.split(/[\s-]/);
      const whole = parseInt(parts[0]);
      const fracParts = parts[1].split('/');
      const numerator = parseInt(fracParts[0]);
      const denominator = parseInt(fracParts[1]);
      return whole >= 0 && numerator > 0 && denominator > 0;
    }

    // Check for pure fractions (e.g., 1/2, 3/4)
    if (/^\d+\/\d+$/.test(trimmed)) {
      const fracParts = trimmed.split('/');
      const numerator = parseInt(fracParts[0]);
      const denominator = parseInt(fracParts[1]);
      return numerator > 0 && denominator > 0;
    }

    return false;
  };

  /**
   * Parse CSV content and extract qty, width, height data
   */
  const parseCSV = (csvText) => {
    const lines = csvText.split('\n').filter((line) => line.trim() !== '');

    if (lines.length === 0) {
      throw new Error('CSV file is empty');
    }

    // Parse header to find column indices
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

    const qtyIndex = headers.findIndex(
      (h) => h.includes('qty') || h.includes('quantity')
    );
    const widthIndex = headers.findIndex(
      (h) => h.includes('width') || h.includes('w')
    );
    const heightIndex = headers.findIndex(
      (h) => h.includes('height') || h.includes('h')
    );

    if (qtyIndex === -1 || widthIndex === -1 || heightIndex === -1) {
      throw new Error('CSV must contain qty, width, and height columns');
    }

    // Parse data rows
    const dimensionData = [];
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map((cell) => cell.trim());

      if (row.length < 3) continue; // Skip incomplete rows

      const qtyStr = row[qtyIndex];
      const widthStr = row[widthIndex];
      const heightStr = row[heightIndex];

      // Validate qty (must be a positive integer)
      const qty = parseInt(qtyStr);
      if (isNaN(qty) || qty <= 0) {
        throw new Error(
          `Invalid quantity in row ${
            i + 1
          }: "${qtyStr}" - must be a positive whole number`
        );
      }

      // Validate width (can be decimal or fraction)
      if (!isValidDimension(widthStr)) {
        throw new Error(
          `Invalid width in row ${
            i + 1
          }: "${widthStr}" - must be a positive number or fraction (e.g., 24, 24.5, 24 1/2)`
        );
      }

      // Validate height (can be decimal or fraction)
      if (!isValidDimension(heightStr)) {
        throw new Error(
          `Invalid height in row ${
            i + 1
          }: "${heightStr}" - must be a positive number or fraction (e.g., 30, 30.25, 30 3/4)`
        );
      }

      dimensionData.push({
        qty: qty,
        width: widthStr, // Keep as string to preserve fraction format
        height: heightStr, // Keep as string to preserve fraction format
        item: dimensionData.length + 1, // Auto-increment item number
      });
    }

    return dimensionData;
  };

  /**
   * Process the uploaded CSV file
   */
  const processCSV = async () => {
    if (!csvFile) {
      NotificationManager.error(
        'Please select a CSV file first',
        'No File Selected',
        3000
      );
      return;
    }

    setIsProcessing(true);

    try {
      const csvText = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error('Failed to read file'));
        reader.readAsText(csvFile);
      });

      const dimensionData = parseCSV(csvText);

      if (dimensionData.length === 0) {
        throw new Error('No valid dimension data found in CSV');
      }

      // Clear existing dimensions (user can manually add back if needed)
      while (fields.length > 0) {
        fields.remove(0);
      }

      // Add new dimensions from CSV
      dimensionData.forEach((dimension) => {
        fields.push(dimension);
      });

      NotificationManager.success(
        `Successfully imported ${dimensionData.length} dimension${
          dimensionData.length === 1 ? '' : 's'
        }`,
        'CSV Import Complete',
        3000
      );

      // Clear file input
      setCsvFile(null);
      document.getElementById(`csv-file-input-${partIndex}`).value = '';
    } catch (error) {
      NotificationManager.error(error.message, 'CSV Import Failed', 5000);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Clear the selected file
   */
  const clearFile = () => {
    setCsvFile(null);
    document.getElementById(`csv-file-input-${partIndex}`).value = '';
  };

  if (!edit) {
    return null; // Don't show uploader in read-only mode
  }

  return (
    <div
      className="csv-dimension-uploader mb-3"
      style={{
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '5px',
        border: '1px solid #dee2e6',
      }}
    >
      <Row>
        <Col>
          <h6 className="mb-2">
            <strong>Import Dimensions from CSV</strong>
          </h6>
          <small className="text-muted mb-2 d-block">
            Upload a CSV file with qty, width, and height columns. This will
            replace existing dimensions for this {partName || 'item'}.
          </small>
        </Col>
      </Row>

      <Row className="align-items-end">
        <Col md="6">
          <Input
            id={`csv-file-input-${partIndex}`}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="mb-2"
          />
          {csvFile && (
            <small className="text-success">Selected: {csvFile.name}</small>
          )}
        </Col>
        <Col md="6">
          <div className="d-flex gap-2">
            <Button
              color="primary"
              size="sm"
              onClick={processCSV}
              disabled={!csvFile || isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Import CSV'}
            </Button>
            {csvFile && (
              <Button
                color="secondary"
                size="sm"
                onClick={clearFile}
                disabled={isProcessing}
              >
                Clear
              </Button>
            )}
          </div>
        </Col>
      </Row>

      <Row className="mt-2">
        <Col>
          <Alert color="info" className="mb-0 py-2">
            <small>
              <strong>CSV Format:</strong> Headers like "qty,width,height" and
              data rows like "1,24.5,30.25" or "2,24 1/2,30 3/4". Supports
              decimals (24.5) and fractions (24 1/2, 1/2, 24-1/2). Column names
              are flexible (quantity/qty, w/width, h/height).
            </small>
          </Alert>
        </Col>
      </Row>
    </div>
  );
};

export default CSVDimensionUploader;
