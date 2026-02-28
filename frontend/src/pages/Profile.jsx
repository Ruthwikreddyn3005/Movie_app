import { useState, useEffect } from "react"
import { useUserContext } from "../contexts/UserContext"
import "../CSS/Profile.css"

const Profile = () => {
    const { user, updateUser } = useUserContext()

    const [profile, setProfile] = useState(null)
    const [editMode, setEditMode] = useState(false)
    const [form, setForm] = useState({})
    const [showPassword, setShowPassword] = useState(false)
    const [saveStatus, setSaveStatus] = useState("") // "saving" | "success" | "error" | ""
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (!user?.id) return
        fetch(`${import.meta.env.VITE_API_URL}/profile/${user.id}`)
            .then(r => {
                if (!r.ok) throw new Error('server error')
                return r.json()
            })
            .then(data => {
                const merged = { ...user, ...data, password: user.password || "" }
                setProfile(merged)
                setForm(merged)
            })
            .catch(() => {
                const fallback = { ...user, phone: user.phone || "", bio: user.bio || "" }
                setProfile(fallback)
                setForm(fallback)
            })
    }, [user?.id])

    const getInitials = (name) => {
        if (!name) return "?"
        return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    }

    const validate = () => {
        const errs = {}
        if (!form.username?.trim()) errs.username = "Username is required"
        if (!form.email?.trim()) errs.email = "Email is required"
        else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email"
        if (!form.password?.trim()) errs.password = "Password is required"
        if (form.phone && !/^\+?[\d\s\-()]{7,15}$/.test(form.phone))
            errs.phone = "Invalid phone number"
        return errs
    }

    const handleSave = async () => {
        const errs = validate()
        if (Object.keys(errs).length > 0) { setErrors(errs); return }
        setErrors({})
        setSaveStatus("saving")

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/profile/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: form.username,
                    email: form.email,
                    password: form.password,
                    phone: form.phone || null,
                    bio: form.bio || null,
                })
            })
            if (!res.ok) throw new Error()
            const updated = { ...user, ...form }
            setProfile(updated)
            updateUser(updated)
            setSaveStatus("success")
            setEditMode(false)
            setTimeout(() => setSaveStatus(""), 2500)
        } catch {
            setSaveStatus("error")
            setTimeout(() => setSaveStatus(""), 3000)
        }
    }

    const handleCancel = () => {
        setForm(profile)
        setErrors({})
        setEditMode(false)
    }

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }))
    }

    if (!user) return <div className="profile-loading"><div className="spinner"/><p>Loading profile...</p></div>
    if (!profile) return <div className="profile-loading"><div className="spinner"/><p>Fetching details...</p></div>

    return (
        <div className="profile-page">

            {/* ── Header card ── */}
            <div className="profile-header-card">
                <div className="profile-header-bg" />
                <div className="profile-header-content">
                    <div className="profile-avatar">
                        {getInitials(profile.username)}
                    </div>
                    <div className="profile-identity">
                        <h1 className="profile-name">{profile.username}</h1>
                        <p className="profile-email-sub">{profile.email}</p>
                        {profile.bio && <p className="profile-bio-sub">{profile.bio}</p>}
                    </div>
                </div>
            </div>

            {/* ── Status banner ── */}
            {saveStatus === "success" && (
                <div className="profile-banner success">Profile updated successfully!</div>
            )}
            {saveStatus === "error" && (
                <div className="profile-banner error">Failed to save. Please try again.</div>
            )}

            {/* ── Details card ── */}
            <div className="profile-card">
                <div className="profile-card-header">
                    <h2>Personal Information</h2>
                    {!editMode ? (
                        <button className="btn-edit" onClick={() => setEditMode(true)}>
                            Edit Profile
                        </button>
                    ) : (
                        <div className="edit-actions">
                            <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
                            <button
                                className="btn-save"
                                onClick={handleSave}
                                disabled={saveStatus === "saving"}
                            >
                                {saveStatus === "saving" ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    )}
                </div>

                <div className="profile-fields">

                    {/* Username */}
                    <div className="profile-field">
                        <div className="field-label">
                            <span className="field-icon">&#128100;</span>
                            Username
                        </div>
                        {editMode ? (
                            <div className="field-input-wrap">
                                <input
                                    className={`field-input ${errors.username ? "input-error" : ""}`}
                                    value={form.username || ""}
                                    onChange={e => handleChange("username", e.target.value)}
                                />
                                {errors.username && <span className="field-error">{errors.username}</span>}
                            </div>
                        ) : (
                            <div className="field-value">{profile.username}</div>
                        )}
                    </div>

                    {/* Email */}
                    <div className="profile-field">
                        <div className="field-label">
                            <span className="field-icon">&#9993;</span>
                            Email
                        </div>
                        {editMode ? (
                            <div className="field-input-wrap">
                                <input
                                    className={`field-input ${errors.email ? "input-error" : ""}`}
                                    type="email"
                                    value={form.email || ""}
                                    onChange={e => handleChange("email", e.target.value)}
                                />
                                {errors.email && <span className="field-error">{errors.email}</span>}
                            </div>
                        ) : (
                            <div className="field-value">{profile.email}</div>
                        )}
                    </div>

                    {/* Phone */}
                    <div className="profile-field">
                        <div className="field-label">
                            <span className="field-icon">&#128241;</span>
                            Phone
                        </div>
                        {editMode ? (
                            <div className="field-input-wrap">
                                <input
                                    className={`field-input ${errors.phone ? "input-error" : ""}`}
                                    type="tel"
                                    placeholder="+91 XXXXX XXXXX"
                                    value={form.phone || ""}
                                    onChange={e => handleChange("phone", e.target.value)}
                                />
                                {errors.phone && <span className="field-error">{errors.phone}</span>}
                            </div>
                        ) : (
                            <div className="field-value">
                                {profile.phone || <span className="not-set">Not set</span>}
                            </div>
                        )}
                    </div>

                    {/* Bio */}
                    <div className="profile-field profile-field-bio">
                        <div className="field-label">
                            <span className="field-icon">&#128203;</span>
                            Bio
                        </div>
                        {editMode ? (
                            <div className="field-input-wrap">
                                <textarea
                                    className="field-input field-textarea"
                                    placeholder="Tell us about yourself..."
                                    value={form.bio || ""}
                                    onChange={e => handleChange("bio", e.target.value)}
                                    rows={3}
                                />
                            </div>
                        ) : (
                            <div className="field-value">
                                {profile.bio || <span className="not-set">Not set</span>}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* ── Security card ── */}
            <div className="profile-card">
                <div className="profile-card-header">
                    <h2>Security</h2>
                </div>
                <div className="profile-fields">

                    {/* Password */}
                    <div className="profile-field">
                        <div className="field-label">
                            <span className="field-icon">&#128274;</span>
                            Password
                        </div>
                        {editMode ? (
                            <div className="field-input-wrap password-wrap">
                                <input
                                    className={`field-input ${errors.password ? "input-error" : ""}`}
                                    type={showPassword ? "text" : "password"}
                                    value={form.password || ""}
                                    onChange={e => handleChange("password", e.target.value)}
                                />
                                <button
                                    className="toggle-pw"
                                    type="button"
                                    onClick={() => setShowPassword(p => !p)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                                {errors.password && <span className="field-error">{errors.password}</span>}
                            </div>
                        ) : (
                            <div className="field-value password-dots">••••••••</div>
                        )}
                    </div>

                </div>
            </div>

        </div>
    )
}

export default Profile
