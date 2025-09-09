import AuditLog from "../models/AuditLog.js";

export const recordAudit =
  (action, collectionName, getTargetId) =>
  async (req, res, next) => {
    // Run next first, then record after successful handler
    try {
      await next();
      const user = res.locals.user || { id: null, role: "anonymous" };
      let targetId = null;
      try {
        targetId = typeof getTargetId === "function" ? await getTargetId(req, res) : null;
      } catch {}
      await AuditLog.create({
        actor: user?.id,
        actorRole: user?.role,
        action,
        collection: collectionName,
        targetId,
        meta: {
          method: req.method,
          path: req.originalUrl,
          body: req.body,
          params: req.params,
          query: req.query
        }
      });
    } catch (e) {
      // Even if logging fails, don't break the response
    }
  };
