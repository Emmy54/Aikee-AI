import { colors } from '../../constants/theme';

export default function PersonalInfoStep({
  stepNumber,
  stepTitle,
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  address,
  setAddress,
  photoPreview,
  handlePhotoUpload,
  next,
  back,
}) {
  return (
    <div className="card">
      <div className="step-tag">Step {stepNumber} — {stepTitle}</div>
      <h1>Tell us about yourself</h1>
      <p className="subtitle">Your personal details will appear in the header of your CV.</p>
      <div className="two-col">
        <div className="field">
          <label>Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
        </div>
        <div className="field">
          <label>Email Address</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
        </div>
      </div>
      <div className="two-col">
        <div className="field">
          <label>Phone Number</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 800 000 0000" />
        </div>
        <div className="field">
          <label>Location / Address</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Lagos, Nigeria" />
        </div>
      </div>
      <div className="field">
        <label>Profile Photo (optional)</label>
        <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ padding: "10px 16px" }} />
        {photoPreview && (
          <img src={photoPreview} alt="preview" style={{ width: 72, height: 72, borderRadius: "50%", marginTop: 12, objectFit: "cover", border: `2px solid ${colors.primary}` }} />
        )}
        {!photoPreview && (
          <p style={{ fontSize: "0.75rem", color: colors.onSurfaceVariant, marginTop: "0.5rem" }}>
            No headshot? Use the ✨ Headshot Generator button in the header to create a professional one!
          </p>
        )}
      </div>
      <button className="btn btn-primary" onClick={next} disabled={!name || !email}>Continue →</button>
      <button className="btn btn-ghost" onClick={back}>← Back</button>
    </div>
  );
}
