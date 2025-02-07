import { Request, Response } from "express";
import { BaseMapper } from "../mappers/baseMapper";

export const transformController = (req: Request, res: Response) => {
  try {
    const inputData = req.body;
    const version =
      inputData?.context?.version || inputData?.context?.core_version;

    if (!version || (version !== "2.0.0" && version !== "1.2.5")) {
      return res.status(400).json({
        error: "Invalid or missing version. Supported versions: 1.2.5, 2.0.0",
      });
    }

    const baseMapper = new BaseMapper();
    const transformedData = baseMapper.transform(inputData, version as string);

    res.json(transformedData);
  } catch (error) {
    console.error("Error during transformation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
