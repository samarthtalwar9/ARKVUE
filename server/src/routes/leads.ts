
import { Router, Request, Response } from "express";
import { pool } from "../config/db";
import { z } from "zod";

const router = Router();

// Lead validation schema
const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255).transform(v => v.toLowerCase()),
  phone: z.string().trim().min(7).max(20),
  company: z.string().trim().max(150).optional(),
  source: z.enum([
    "Website",
    "Referral",
    "LinkedIn",
    "Event",
    "Other"
  ]).default("Website"),
  status: z.enum([
    "New",
    "Contacted",
    "Qualified",
    "Converted"
  ]).default("New")
});

// Common error handler
function handleError(error: any, res: Response) {
  console.error("Lead API Error:", error);

  if (error.code === "23505") {
    return res.status(409).json({
      success: false,
      message: "A lead with this email or phone already exists."
    });
  }

  if (error.code === "22P02") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format."
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error."
  });
}

// POST: Create a new lead
router.post("/", async (req: Request, res: Response) => {
  const parsed = leadSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: parsed.error.flatten()
    });
  }

  const data = parsed.data;

  try {
    const result = await pool.query(
      `INSERT INTO leads
       (name, email, phone, company, source, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        data.name,
        data.email,
        data.phone,
        data.company || null,
        data.source,
        data.status
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Lead created successfully.",
      lead: result.rows[0]
    });

  } catch (error) {
    return handleError(error, res);
  }
});

// GET: Retrieve all leads with search, filters and pagination
router.get("/", async (req: Request, res: Response) => {
  try {
    const search = String(req.query.search || "");
    const status = String(req.query.status || "");
    const source = String(req.query.source || "");

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const values: any[] = [];

    if (search) {
      values.push(`%${search}%`);
      const index = values.length;

      conditions.push(
        `(name ILIKE $${index}
        OR email ILIKE $${index}
        OR company ILIKE $${index}
        OR phone ILIKE $${index})`
      );
    }

    if (status) {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    if (source) {
      values.push(source);
      conditions.push(`source = $${values.length}`);
    }

    const where = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM leads ${where}`,
      values
    );

    const result = await pool.query(
      `SELECT * FROM leads ${where}
       ORDER BY created_at DESC
       LIMIT $${values.length + 1}
       OFFSET $${values.length + 2}`,
      [...values, limit, offset]
    );

    return res.status(200).json({
      success: true,
      total: Number(countResult.rows[0].count),
      page,
      limit,
      leads: result.rows
    });

  } catch (error) {
    return handleError(error, res);
  }
});

// GET: Retrieve one lead by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const idSchema = z.string().uuid().safeParse(req.params.id);

    if (!idSchema.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID."
      });
    }

    const result = await pool.query(
      "SELECT * FROM leads WHERE id = $1",
      [idSchema.data]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lead not found."
      });
    }

    return res.status(200).json({
      success: true,
      lead: result.rows[0]
    });

  } catch (error) {
    return handleError(error, res);
  }
});

// PUT: Update an existing lead
router.put("/:id", async (req: Request, res: Response) => {
  const idSchema = z.string().uuid().safeParse(req.params.id);

  if (!idSchema.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid lead ID."
    });
  }

  const parsed = leadSchema.partial().safeParse(req.body);

  if (!parsed.success || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid update data.",
      errors: parsed.success ? undefined : parsed.error.flatten()
    });
  }

  try {
    const fields = parsed.data;
    const keys = Object.keys(fields) as (keyof typeof fields)[];

    const values = keys.map(key => fields[key]);

    const assignments = keys.map(
      (key, index) => `${key} = $${index + 1}`
    );

    const result = await pool.query(
      `UPDATE leads
       SET ${assignments.join(", ")},
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $${keys.length + 1}
       RETURNING *`,
      [...values, idSchema.data]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lead not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lead updated successfully.",
      lead: result.rows[0]
    });

  } catch (error) {
    return handleError(error, res);
  }
});

export default router;
