import { asyncHandler } from "../utils/asyncHandler.js";
import Setting from "../models/Setting.js";
import type { Request, Response } from "express";

export const getSetting = asyncHandler(async (req: Request, res: Response) => {
  const { key } = req.params;
  const setting = await Setting.findOne({ key });
  res.json({ value: setting?.value ?? null });
});

export const setSetting = asyncHandler(async (req: Request, res: Response) => {
  const { key } = req.params;
  const { value } = req.body;
  const setting = await Setting.findOneAndUpdate(
    { key },
    { key, value },
    { upsert: true, returnDocument: "after" }
  );
  res.json(setting);
});

export const getAllSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await Setting.find();
  const map: Record<string, any> = {};
  settings.forEach(s => (map[s.key] = s.value));
  res.json(map);
});