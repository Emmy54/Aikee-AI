import { useState } from 'react';
import { colors } from '../../constants/theme';
import { generateHeadshotFromImage } from '../../services/stabilityService';
import { compressImageFile } from '../../utils/imageCompression';


export default function HeadshotGenerator({ onBack, stabilityStatus }) {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [croppingMode, setCroppingMode] = useState(null);
  const [processedHeadshot, setProcessedHeadshot] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState(null);

  // Downscale on the way in. Several full-size phone photos held as base64 data
  // URLs at once is a lot of memory for no benefit — the headshot is rendered at
  // 512px anyway (see generateHeadshotFromImage).
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    setProcessingError(null);

    for (const file of files) {
      if (!file.type?.startsWith('image/')) continue;
      try {
        const { dataUrl } = await compressImageFile(file);
        setUploadedImages((prev) => [
          ...prev,
          { id: `${file.name}-${prev.length}-${file.size}`, src: dataUrl, fileName: file.name },
        ]);
      } catch (err) {
        console.error('Image upload failed:', err);
        setProcessingError(
          `Couldn't read "${file.name}". ${err?.message || 'Please try a different image.'}`
        );
      }
    }
  };

  const removeImage = (id) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
    if (selectedImageIndex !== null && selectedImageIndex >= uploadedImages.length - 1) {
      setSelectedImageIndex(null);
    }
  };

  const selectImage = (index) => {
    setSelectedImageIndex(index);
    setProcessedHeadshot(null);
  };

  const processHeadshot = async () => {
    if (selectedImageIndex === null) return;

    setIsProcessing(true);
    setProcessingError(null);
    const selectedImage = uploadedImages[selectedImageIndex];

    try {
      const processedSrc = await generateHeadshotFromImage(selectedImage.src);
      setProcessedHeadshot({
        src: processedSrc,
        original: selectedImage.src,
      });
    } catch (error) {
      console.error("Headshot processing error:", error);
      setProcessingError(`Processing error: ${error.message}. Using standard processing.`);
      try {
        const processedSrc = await generateHeadshotFromImage(selectedImage.src);
        setProcessedHeadshot({
          src: processedSrc,
          original: selectedImage.src,
        });
      } catch (fallbackError) {
        console.error("Headshot fallback error:", fallbackError);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadHeadshot = () => {
    if (!processedHeadshot) return;

    const link = document.createElement('a');
    link.href = processedHeadshot.src;
    link.download = `headshot-${Date.now()}.jpg`;
    link.click();
  };

  const downloadAllHeadshots = async () => {
    for (let index = 0; index < uploadedImages.length; index += 1) {
      const img = uploadedImages[index];
      try {
        const processedSrc = await generateHeadshotFromImage(img.src);
        const link = document.createElement('a');
        link.href = processedSrc;
        link.download = `headshot-${index + 1}-${Date.now()}.jpg`;
        setTimeout(() => link.click(), index * 200);
      } catch (error) {
        console.error("Batch headshot processing error:", error);
      }
    }
  };

  return (
    <>
      <style>{`
        .headshot-generator-container {
          min-height: 100vh;
          background: radial-gradient(ellipse at 20% 0%, #1a1a2e 0%, ${colors.bg} 60%);
          display: flex;
          flex-direction: column;
          padding: 40px 20px;
        }

        .headshot-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 40px;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
          width: 100%;
        }

        .headshot-title {
          color: ${colors.accent};
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
        }

        .headshot-status {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 999px;
          border: 1px solid ${colors.border};
          color: ${colors.muted};
        }

        .back-to-cv-btn {
          background: transparent;
          border: 1px solid ${colors.border};
          color: ${colors.muted};
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }

        .back-to-cv-btn:hover {
          border-color: ${colors.muted};
          color: ${colors.text};
        }

        .headshot-main {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
          width: 100%;
        }

        .upload-section {
          background: ${colors.card};
          border: 1px solid ${colors.border};
          border-radius: 20px;
          padding: 32px;
        }

        .upload-area {
          border: 2px dashed ${colors.accent};
          border-radius: 12px;
          padding: 40px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: rgba(200, 169, 110, 0.05);
        }

        .upload-area:hover {
          background: rgba(200, 169, 110, 0.1);
          border-color: ${colors.accentLight};
        }

        .upload-icon {
          font-size: 48px;
          margin-bottom: 12px;
        }

        .upload-text {
          color: ${colors.text};
          font-size: 15px;
          margin-bottom: 4px;
        }

        .upload-hint {
          color: ${colors.muted};
          font-size: 12px;
        }

        .image-thumbs {
          margin-top: 24px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 12px;
        }

        .image-thumb {
          position: relative;
          border: 2px solid ${colors.border};
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s;
          aspect-ratio: 1;
        }

        .image-thumb:hover {
          border-color: ${colors.accent};
        }

        .image-thumb.selected {
          border-color: ${colors.accent};
          box-shadow: 0 0 0 3px rgba(200, 169, 110, 0.2);
        }

        .image-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-thumb {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          border: none;
          border-radius: 4px;
          width: 20px;
          height: 20px;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .image-thumb:hover .remove-thumb {
          opacity: 1;
        }

        .preview-section {
          background: ${colors.card};
          border: 1px solid ${colors.border};
          border-radius: 20px;
          padding: 32px;
          display: flex;
          flex-direction: column;
        }

        .preview-box {
          background: ${colors.bg};
          border: 1px solid ${colors.border};
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          text-align: center;
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .preview-image {
          max-width: 100%;
          max-height: 300px;
          border-radius: 8px;
        }

        .preview-text {
          color: ${colors.muted};
          font-size: 13px;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          flex-direction: column;
        }

        .btn {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          text-align: center;
        }

        .btn-primary {
          background: linear-gradient(135deg, ${colors.accent}, ${colors.accentLight});
          color: #0a0a0f;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(200, 169, 110, 0.35);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: transparent;
          border: 1px solid ${colors.border};
          color: ${colors.muted};
        }

        .btn-secondary:hover {
          border-color: ${colors.accent};
          color: ${colors.accent};
        }

        .image-counter {
          color: ${colors.muted};
          font-size: 12px;
          margin-top: 16px;
        }

        @media (max-width: 900px) {
          .headshot-main {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="headshot-generator-container">
        <div className="headshot-header">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h1 className="headshot-title">✨ Professional Headshot Generator</h1>
            {stabilityStatus && (
              <span
                className="headshot-status"
                style={{
                  borderColor: stabilityStatus.valid ? colors.accent : colors.border,
                  color: stabilityStatus.valid ? colors.accent : colors.muted,
                }}
              >
                {stabilityStatus.valid ? "Headshots: OK" : "Headshots: Off"}
              </span>
            )}
          </div>
          <button className="back-to-cv-btn" onClick={onBack}>
            ← Back to CV Builder
          </button>
        </div>

        <div className="headshot-main">
          {/* Upload Section */}
          <div className="upload-section">
            <h2 style={{ color: colors.text, marginBottom: 20, fontFamily: "'Playfair Display', serif", fontSize: 20 }}>
              Upload Images
            </h2>

            <label className="upload-area">
              <div className="upload-icon">📸</div>
              <div className="upload-text">Click to upload or drag & drop</div>
              <div className="upload-hint">PNG, JPG, GIF up to 10MB each</div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </label>

            {uploadedImages.length > 0 && (
              <>
                <div className="image-thumbs">
                  {uploadedImages.map((img, index) => (
                    <div
                      key={img.id}
                      className={`image-thumb ${selectedImageIndex === index ? 'selected' : ''}`}
                      onClick={() => selectImage(index)}
                    >
                      <img src={img.src} alt={img.fileName} />
                      <button
                        className="remove-thumb"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(img.id);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <div className="image-counter">
                  {uploadedImages.length} image{uploadedImages.length !== 1 ? 's' : ''} uploaded
                </div>
              </>
            )}
          </div>

          {/* Preview Section */}
          <div className="preview-section">
            <h2 style={{ color: colors.text, marginBottom: 20, fontFamily: "'Playfair Display', serif", fontSize: 20 }}>
              Preview & Download
            </h2>

            <div className="preview-box">
              {processingError && (
                <div style={{ color: '#ff6b6b', fontSize: '12px', marginBottom: '12px' }}>
                  ⚠️ {processingError}
                </div>
              )}
              {isProcessing ? (
                <span className="preview-text">⏳ Generating professional headshot with AI...</span>
              ) : processedHeadshot ? (
                <img src={processedHeadshot.src} alt="Processed Headshot" className="preview-image" />
              ) : selectedImageIndex !== null ? (
                <span className="preview-text">Click "Process Headshot" to generate</span>
              ) : (
                <span className="preview-text">Select an image to preview</span>
              )}
            </div>

            <div className="action-buttons">
              <button
                className="btn btn-primary"
                onClick={processHeadshot}
                disabled={selectedImageIndex === null || isProcessing}
              >
                {isProcessing ? '⏳ Processing...' : '✨ Process Single Headshot'}
              </button>

              {uploadedImages.length > 1 && (
                <button
                  className="btn btn-secondary"
                  onClick={downloadAllHeadshots}
                >
                  📥 Download All ({uploadedImages.length})
                </button>
              )}

              {processedHeadshot && (
                <button
                  className="btn btn-primary"
                  onClick={downloadHeadshot}
                >
                  📥 Download Processed Image
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
