<script>
/**
 * Global patch: make jsPDF.save() iOS-friendly (download/share instead of preview).
 * Put this AFTER jspdf.umd.min.js is loaded.
 */
(function patchJsPDFSaveIOS(){
  if(!window.jspdf || !window.jspdf.jsPDF) return;

  const jsPDF = window.jspdf.jsPDF;
  const originalSave = jsPDF.prototype.save;

  function isIOS(){
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }

  async function downloadPdfIOSFriendly(pdf, filename){
    const blob = pdf.output("blob");
    const file = new File([blob], filename, { type: "application/pdf" });

    // iOS: prefer Share sheet (Save to Files)
    if (isIOS() && navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
      try {
        await navigator.share({ files: [file], title: filename, text: "PDF Export" });
        return;
      } catch (e) {
        // user canceled or share failed -> fallback below
      }
    }

    // Standard: <a download>
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "download.pdf";
    a.rel = "noopener";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // iOS fallback: open in new tab so user can Share/Save
    if (isIOS()) {
      setTimeout(() => {
        try { window.open(url, "_blank"); } catch(_) {}
      }, 200);
    }

    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  // Override jsPDF.save
  jsPDF.prototype.save = function(filename){
    // Return a Promise so calling code doesn't break
    return downloadPdfIOSFriendly(this, filename || "download.pdf")
      .catch(() => {
        // last fallback: original behavior
        try { return originalSave.call(this, filename); } catch(e) {}
      });
  };
})();
</script>
