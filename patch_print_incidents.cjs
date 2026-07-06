const fs = require('fs');
let code = fs.readFileSync('src/components/IncidentLogsView.tsx', 'utf8');

const printFunc = `
  const handlePrintSingleIncident = (incident: CampIncident) => {
    const htmlContent = \`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Olay Tutanağı - \${incident.id}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.6; padding: 40px; margin: 0; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; }
          .title { font-size: 24px; font-weight: bold; margin: 0 0 10px 0; }
          .subtitle { font-size: 14px; color: #6b7280; margin: 0; }
          .meta-container { display: flex; justify-content: space-between; margin-bottom: 30px; background-color: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; }
          .meta-item { margin-bottom: 8px; }
          .meta-label { font-weight: bold; font-size: 12px; color: #6b7280; text-transform: uppercase; }
          .meta-value { font-size: 14px; color: #111827; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
          .section-content { font-size: 14px; color: #374151; white-space: pre-wrap; background-color: #ffffff; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
          .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; text-align: center; }
          .signature-box { width: 45%; }
          .signature-line { margin-top: 50px; border-top: 1px solid #333; padding-top: 5px; font-weight: bold; }
          .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
          .badge-red { background-color: #fee2e2; color: #b91c1c; }
          .badge-green { background-color: #d1fae5; color: #047857; }
          .badge-gray { background-color: #f3f4f6; color: #4b5563; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">RESMİ OLAY TUTANAĞI</h1>
          <p class="subtitle">Belge No: \${incident.id} | Tarih: \${new Date().toLocaleDateString('tr-TR')}</p>
        </div>

        <div class="meta-container">
          <div>
            <div class="meta-item">
              <div class="meta-label">Olay Türü</div>
              <div class="meta-value">\${incident.type.toUpperCase()}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Olay Tarihi ve Saati</div>
              <div class="meta-value">\${new Date(incident.dateTime).toLocaleString('tr-TR')}</div>
            </div>
          </div>
          <div>
            <div class="meta-item">
              <div class="meta-label">Durum</div>
              <div class="meta-value">
                <span class="badge \${incident.status === 'Açık' ? 'badge-red' : 'badge-green'}">\${incident.status}</span>
              </div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Raporlayan (Bildiren)</div>
              <div class="meta-value">\${incident.reporterName}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Olay Başlığı</h2>
          <div class="meta-value" style="font-size: 16px; font-weight: bold;">\${incident.title}</div>
        </div>

        <div class="section">
          <h2 class="section-title">Olayın Detayları (Açıklama)</h2>
          <div class="section-content">\${incident.description}</div>
        </div>

        \${incident.actionTaken ? \`
        <div class="section">
          <h2 class="section-title">Alınan Aksiyon / Sonuç</h2>
          <div class="section-content">\${incident.actionTaken}</div>
        </div>
        \` : ''}

        <div class="footer">
          <div class="signature-box">
            <div class="meta-label">Bildiren Yetkili</div>
            <div class="meta-value" style="margin-bottom: 40px;">\${incident.reporterName}</div>
            <div class="signature-line">İmza</div>
          </div>
          <div class="signature-box">
            <div class="meta-label">Kamp Yöneticisi / Onay</div>
            <div class="meta-value" style="margin-bottom: 40px;">&nbsp;</div>
            <div class="signature-line">İmza</div>
          </div>
        </div>
      </body>
      </html>
    \`;

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(htmlContent);
      doc.close();

      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 500);
    }
  };
`;

code = code.replace(
  /const handleDeleteIncident = \(id: string\) => \{/,
  printFunc + "\n  const handleDeleteIncident = (id: string) => {"
);

// Now add the button to the incident actions
const actionButtons = `<button
                    onClick={() => handleDeleteIncident(inc.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Kaydı Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>`;

const newActionButtons = `<button
                    onClick={() => handlePrintSingleIncident(inc)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                    title="Olay Tutanağını Yazdır / PDF İndir"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteIncident(inc.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Kaydı Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>`;

code = code.replace(actionButtons, newActionButtons);

fs.writeFileSync('src/components/IncidentLogsView.tsx', code);
