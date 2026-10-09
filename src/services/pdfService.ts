import { AnalysisResult, LanguageCode } from '../types';
import { formatDate } from '../utils/dateUtils';
import { translations } from '../i18n';

export async function generatePdfReport(
  analysis: AnalysisResult,
  language: LanguageCode = 'en'
): Promise<void> {
  const t = translations[language]?.pdf || translations.en.pdf;
  const commonT = translations[language]?.results || translations.en.results;

  // Create a clean printable window or trigger jsPDF
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download and print the PDF report.');
    return;
  }

  const severityColorMap = {
    High: '#dc2626',
    Medium: '#ea580c',
    Low: '#16a34a',
    Healthy: '#059669',
  };

  const severityBadgeColor = severityColorMap[analysis.severity] || '#16a34a';

  const htmlContent = `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <title>${t.reportTitle} - ${analysis.cropName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 30px;
      color: #1e293b;
      background: #ffffff;
      line-height: 1.5;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #16a34a;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .brand-title {
      font-size: 26px;
      font-weight: 800;
      color: #16a34a;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .brand-sub {
      font-size: 13px;
      color: #64748b;
      font-weight: 500;
      margin-top: 2px;
    }
    .report-meta {
      text-align: right;
      font-size: 13px;
      color: #475569;
    }
    .report-id {
      font-family: monospace;
      font-weight: 700;
      color: #0f172a;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      color: white;
      background: ${severityBadgeColor};
      text-transform: uppercase;
    }
    .main-grid {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 24px;
      margin-bottom: 24px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
    }
    .crop-img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
    }
    .summary-title {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 6px 0;
    }
    .scientific-name {
      font-style: italic;
      color: #64748b;
      font-size: 14px;
      margin-bottom: 14px;
    }
    .metric-row {
      display: flex;
      gap: 24px;
      margin-top: 14px;
    }
    .metric-card {
      background: white;
      border: 1px solid #e2e8f0;
      padding: 10px 16px;
      border-radius: 8px;
    }
    .metric-label {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
      font-weight: 600;
    }
    .metric-val {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
    }
    .section-box {
      margin-bottom: 20px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 16px 20px;
    }
    .section-heading {
      font-size: 15px;
      font-weight: 700;
      color: #166534;
      margin: 0 0 12px 0;
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 8px;
    }
    .rx-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    ul {
      margin: 0;
      padding-left: 20px;
    }
    li {
      margin-bottom: 6px;
      font-size: 13px;
      color: #334155;
    }
    .immediate-box {
      background: #fef2f2;
      border-left: 4px solid #ef4444;
      padding: 12px 16px;
      border-radius: 6px;
      margin-bottom: 16px;
      font-size: 13px;
      color: #991b1b;
      font-weight: 600;
    }
    .footer-box {
      margin-top: 30px;
      border-top: 1px solid #cbd5e1;
      padding-top: 16px;
      text-align: center;
      font-size: 11px;
      color: #64748b;
    }
    .print-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #16a34a;
      color: white;
      border: none;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(22, 163, 74, 0.4);
    }
    @media print {
      .print-button { display: none; }
      body { padding: 15px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand-title">🌱 AI Crop Assistant</div>
      <div class="brand-sub">${t.issuedBy}</div>
    </div>
    <div class="report-meta">
      <div>${t.date}: <strong>${formatDate(analysis.createdAt, language)}</strong></div>
      <div>${t.reportId}: <span class="report-id">${analysis.id.toUpperCase()}</span></div>
    </div>
  </div>

  <div class="main-grid">
    <div>
      <img src="${analysis.imageUrl}" alt="${analysis.cropName}" class="crop-img" />
    </div>
    <div>
      <div class="summary-title">${analysis.cropName} – ${analysis.diseaseName}</div>
      ${analysis.scientificName ? `<div class="scientific-name">${analysis.scientificName}</div>` : ''}
      <span class="badge">${analysis.severity} Risk Alert</span>
      
      <div class="metric-row">
        <div class="metric-card">
          <div class="metric-label">${commonT.confidence}</div>
          <div class="metric-val" style="color: #16a34a;">${analysis.confidence}%</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">${commonT.crop}</div>
          <div class="metric-val">${analysis.cropName}</div>
        </div>
      </div>
    </div>
  </div>

  ${
    analysis.recommendedCare.immediateAction
      ? `
    <div class="immediate-box">
      ⚡ <strong>${commonT.immediateAction}:</strong> ${analysis.recommendedCare.immediateAction}
    </div>
  `
      : ''
  }

  <div class="section-box">
    <div class="section-heading">🔍 ${t.observedSymptoms}</div>
    <ul>
      ${analysis.symptoms.map((s) => `<li>${s}</li>`).join('')}
    </ul>
  </div>

  <div class="section-box">
    <div class="section-heading">💊 ${t.prescribedTreatment}</div>
    <div class="rx-grid">
      <div>
        <strong style="color: #15803d; font-size: 13px; display: block; margin-bottom: 6px;">🌿 ${commonT.organicCare}</strong>
        <ul>
          ${analysis.recommendedCare.organic.map((o) => `<li>${o}</li>`).join('')}
        </ul>
      </div>
      <div>
        <strong style="color: #b91c1c; font-size: 13px; display: block; margin-bottom: 6px;">🧪 ${commonT.chemicalCare}</strong>
        <ul>
          ${analysis.recommendedCare.chemical.map((c) => `<li>${c}</li>`).join('')}
        </ul>
      </div>
    </div>
  </div>

  <div class="section-box">
    <div class="section-heading">🛡️ ${t.preventiveMeasures}</div>
    <ul>
      ${analysis.prevention.map((p) => `<li>${p}</li>`).join('')}
    </ul>
  </div>

  <div class="footer-box">
    <p>${t.disclaimer}</p>
    <p><strong>${t.footer}</strong></p>
  </div>

  <button class="print-button" onclick="window.print()">🖨️ Print / Save as PDF</button>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
