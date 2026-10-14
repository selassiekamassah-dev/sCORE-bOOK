# Student Score Book

A simple website for managing a class's scores. It is the chosen application for the assignment *Real-World Applications of Arrays*. The whole program is built on arrays.

## What the site does

- Add a student with a name and a score (0 to 100).
- Remove a student.
- Sort students from highest to lowest score.
- Search for a student by name.
- Show a summary: number of students, average, highest, lowest, how many passed and how many failed.
- Change the pass mark (the default is 50).
- Keep the data after a page refresh (saved in the browser).

## How to run it

Open `index.html` in any browser. Nothing needs to be installed.

## Project files

- `index.html`: the page structure
- `style.css`: the styling
- `script.js`: all the array code (the main file)

## How arrays are used

The data is stored in two **parallel arrays**. The same index always refers to the same student.

```js
let names  = ["Ama", "Kwame", "Esi", "Kofi", "Abena"];
let scores = [78, 45, 92, 60, 55];

// names[2] is "Esi" and scores[2] is 92
```

### 1. Adding a student

`push` adds a value to the end of an array. It is called on both arrays.

```js
names.push(name);
scores.push(score);
```

### 2. Removing a student

`splice` removes the item at an index. The same index is removed from both arrays so they stay matched.

```js
names.splice(index, 1);
scores.splice(index, 1);
```

### 3. Working out the results

One loop visits every score once. The total, the highest, the lowest and the pass count are all updated inside the loop.

```js
for (let i = 0; i < scores.length; i++) {
  total += scores[i];
  if (scores[i] > scores[highestIndex]) highestIndex = i;
  if (scores[i] < scores[lowestIndex]) lowestIndex = i;
  if (scores[i] >= passMark) passed++;
}
average = total / scores.length;
```

### 4. Searching (linear search)

The program checks each name in turn and remembers the indexes that match.

```js
for (let i = 0; i < names.length; i++) {
  if (names[i].toLowerCase().includes(query)) {
    found.push(i);
  }
}
```

### 5. Sorting (bubble sort)

Neighbouring scores are compared and swapped when they are in the wrong order. Both arrays are swapped together so each name stays with its score.

```js
if (scores[j] < scores[j + 1]) {
  [scores[j], scores[j + 1]] = [scores[j + 1], scores[j]];
  [names[j], names[j + 1]] = [names[j + 1], names[j]];
}
```

## Why arrays are needed here

- One name holds many values. Without arrays, every student would need a separate variable.
- Every student's score is reached directly by its index.
- Loops work naturally on arrays, which makes totals, averages, searching and sorting simple.
- The same code works for 5 students or 500 students.

## Speed of each operation

- Reading `scores[i]`: constant time, O(1).
- Adding to the end with `push`: O(1).
- Removing with `splice`: O(n), because later items shift up by one.
- Searching by name: O(n), because each name may need to be checked.
- Bubble sort: O(n squared). It is simple, and fine for a class-sized list.

## The same idea in C++

The assignment PDF uses C++. In C++ the array size is fixed when the array is created:

```cpp
const int SIZE = 5;
string names[SIZE]  = {"Ama", "Kwame", "Esi", "Kofi", "Abena"};
int    scores[SIZE] = {78, 45, 92, 60, 55};

for (int i = 0; i < SIZE; i++) {
    total += scores[i];
}
```

JavaScript arrays can grow and shrink, so `push` and `splice` work without a fixed size. The logic is otherwise the same.

## Other real-world uses of arrays

- Image and video processing: a photo is a 2D array of pixels.
- Music playlists: songs stored in order, with next and previous moving the index.
- Mobile money and banking: transaction histories and monthly balances.
- Weather records: hourly temperatures and monthly rainfall.
- Games: Oware pits, chess boards, Sudoku grids and high-score tables.
- Shops and e-commerce: product names, prices and stock levels.

## Why JavaScript

JavaScript runs in every browser without installing anything, and GitHub Pages can host it for free. C++ cannot run directly in a web page without an extra conversion tool, so JavaScript is the simpler choice for a website.

## Possible questions from a lecturer

**Why two arrays instead of one?**
Each array holds one type of data (text or numbers), and the same index links them. A larger program could use one array of objects instead, but parallel arrays show the array idea most clearly.

**What happens if the arrays get out of step?**
Names would no longer match scores. That is why every operation (add, remove, sort) changes both arrays together.

**What is the weakness of arrays?**
Inserting or removing in the middle is slow because items must shift. In C++ the size is also fixed once the array is created.

**Where is the data stored?**
In the arrays while the page is open, and in the browser's local storage so it survives a refresh. There is no server or database.

## Deploying on GitHub Pages

1. Create a free account at github.com.
2. Click **+** (top right), then **New repository**.
3. Name it `score-book`, choose **Public**, and click **Create repository**.
4. Click **uploading an existing file** and drag in `index.html`, `style.css`, `script.js` and `README.md`. Upload the files, not a folder.
5. Click **Commit changes**.
6. Go to **Settings**, then **Pages**.
7. Under **Build and deployment**, choose **Deploy from a branch**, select branch **main** and folder **/ (root)**, then click **Save**.
8. After one or two minutes the live link appears at the top of the Pages screen:
   `https://YOUR-USERNAME.github.io/score-book/`
