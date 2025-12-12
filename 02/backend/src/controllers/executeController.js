import executeService from "../services/executeService.js";

export const execute = async (req, res) => {
  const { language, code, input } = req.body || {};
  const { output, error } = await executeService.executeCode({
    language,
    code,
    input,
  });

  if (error) {
    return res.status(400).json({ error, output });
  }

  res.json({ output });
};

