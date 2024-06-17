// Imports
const express = require("express");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "/public/css"));
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/img", express.static(__dirname + "/public/img"));

const tf_idf_filePath = __dirname + "/txt/Vectorized_Documents.txt";
const Words_filePath = __dirname + "/txt/Words.txt";
const Title_filePath = __dirname + "/txt/Title.txt";
const Links_filePath = __dirname + "/txt/Links.txt";

const Vectorized_Documents = Load_Vectorized_Documents(tf_idf_filePath);
const Words = LoadFile(Words_filePath);
const Title = LoadFile(Title_filePath);
const Links = LoadFile(Links_filePath);

app.get("/", (req, res) => {
  const results = [];
  res.render("index", { results });
});

app.get("/search", (req, res) => {
  const searchTerm = req.query.q;
  // console.log(searchTerm);
  const results = PerformSearch(searchTerm);
  // console.info(results);
  res.render("index", { results });
});

// Listen on port 3000
app.listen(port, () => console.info(`listening on port ${port}`));

function PerformSearch(searchTerm) {
  const query = searchTerm.toLowerCase().split(" ");
  // console.log(query);
  const queryVector = VectorizedQuery(query, Words);
  // console.log(queryVector);
  const similarity = calculateSimilarity(queryVector, Vectorized_Documents);
  // console.log(similarity+'/n/n/n');
  const SortedDocumentIndex = calculateDocumentOrder(similarity);
  // console.log(SortedDocumentIndex);
  const ProcessedResult = ProcessResult(SortedDocumentIndex, Title, Links);
  return ProcessedResult;
}

function VectorizedQuery(query, words) {
  const newVector = [];

  for (const word of words) {
    let flag = false;
    for (const queryString of query) {
      if (queryString === word) {
        flag = true;
        break;
      }
    }
    if (flag) {
      newVector.push(1);
    } else {
      newVector.push(0);
    }
  }

  return newVector;
}

function dotProduct(vector1, vector2) {
  let result = 0;
  for (let i = 0; i < vector1.length; i++) {
    result += vector1[i] * vector2[i];
  }
  return result;
}

function magnitude(vector) {
  let sumOfSquares = 0;
  for (let i = 0; i < vector.length; i++) {
    sumOfSquares += vector[i] * vector[i];
  }
  return Math.sqrt(sumOfSquares);
}

function calculateSimilarity(queryVector, vectorizationMatrix) {
  const similarityMat = [];
  for (const vector of vectorizationMatrix) {
    const dotProd = dotProduct(queryVector, vector);
    const magnitude1 = magnitude(queryVector);
    const magnitude2 = magnitude(vector);

    if (magnitude1 === 0 || magnitude2 === 0) {
      similarityMat.push(0);
      continue;
    }

    const similarity = dotProd / (magnitude1 * magnitude2);
    similarityMat.push(similarity);
  }
  return similarityMat;
}

function calculateDocumentOrder(similarity) {
  let similarityScoreDocumentDict = {};
  let index = 1;
  for (const score of similarity) {
    similarityScoreDocumentDict[index] = score;
    index += 1;
  }

  // Convert dictionary to array of key-value pairs
  const entries = Object.entries(similarityScoreDocumentDict);

  entries.sort((a, b) => b[1] - a[1]);

  // Construct a new sorted dictionary from the sorted array
  const SortedDocumentIndex = [];
  for (const [key, value] of entries) {
    // sortedDictionary[value] = key;
    if (value > 0.0) {
      SortedDocumentIndex.push(key);
    }
  }

  const uniqueVector = [];

  for (const num of SortedDocumentIndex) {
    if (!uniqueVector.includes(num)) {
      uniqueVector.push(num);
    }
  }
  return uniqueVector;
}

function ProcessResult(SortedDocumentIndex, Title, Links) {
  var searchResults = [];
  for (const index of SortedDocumentIndex) {
    var result = { title: Title[index - 1], link: Links[index - 1] };
    searchResults.push(result);
  }
  return searchResults;
}

function Load_Vectorized_Documents(tf_idf_filePath) {
  const matrix = [];
  const rows = fs.readFileSync(tf_idf_filePath, "utf8").split("\n");
  // const rows = data.split('\n');

  for (let row of rows) {
    const values = row.trim().split(" ").map(parseFloat);
    matrix.push(values);
  }
  return matrix;
}

function LoadFile(filename) {
  const wordVector = [];
  const lines = fs.readFileSync(filename, "utf8").split("\n");

  for (const line of lines) {
    const word = line.trim();
    wordVector.push(word);
  }
  return wordVector;
}
