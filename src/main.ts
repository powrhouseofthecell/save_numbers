import express, { Request, Response } from 'express'
import fs from 'fs'
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  2.1. If number is > 140 => file A
//  2.2. If number is > 100 => file B
//  2.3. If number is > 60 => file C
//  2.4. All other numbers => file D

// 30 -> A
// 15 -> B
// 10 -> C
//  5 -> D

const files = {
  A: 'files/A.txt',
  B: 'files/B.txt',
  C: 'files/C.txt',
  D: 'files/D.txt'
};

const file_paths = Object.values(files);

// Helper function to check if all files have at least one number
const all_files_populated = () => {
  return file_paths.every(file => {
    const content = fs.readFileSync(file, 'utf-8');
    return content.trim().length > 0;
  });
};

// Initialize files
file_paths.forEach(file => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, '');
  }
});

// API to handle user input
app.post('/input', (req: Request, res: Response) => {
  const { number } = req.body;

  if (typeof number !== 'number') {
    return res.status(400).send('Input must be a number between 1 and 25.');
  }

  const result = number * 7;

  let target_file;

  if (result > 140) {
    target_file = files.A;
  } else if (result > 100) {
    target_file = files.B;
  } else if (result > 60) {
    target_file = files.C;
  } else {
    target_file = files.D;
  }

  if (all_files_populated()) {
    return res.status(400).json({
      error: true,
      message: 'All files are already populated with at least one number. No new entries allowed.'
    });
  }

  fs.appendFileSync(target_file, `${result}\n`);

  return res.status(201).json({
    error: false,
    message: `Number ${result} stored in ${target_file}.`
  });
});

// API to display the contents of all files (json)
app.get('/files', (_req: Request, res: Response) => {
  const file_contents: any = {};

  file_paths.forEach(file => {
    file_contents[file] = fs.readFileSync(file, 'utf-8').trim().split('\n').filter(Boolean);
  });

  res.status(200).json({
    error: false,
    data: file_contents
  });
});

export const server = app.listen(8000, () => {
  console.log('Server is running on port 8000');
});


export default app 
