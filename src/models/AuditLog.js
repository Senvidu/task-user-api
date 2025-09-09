import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    actorRole: { type: String },
    action: { type: String, required: true },
    collection: { type: String, required: true }, // keep this name (Option B)
    targetId: { type: String },
    meta: { type: Object }
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true // <-- this silences the warning
  }
);

const AuditLog = mongoose.model("AuditLog", AuditLogSchema);
export default AuditLog;

//testing nodemon
//two