# Search-Engine-On-DSA-Questions
DSA Search Engine
## Description:
This project presents a search engine for Data Structures and Algorithms (DSA) questions. It involves an extensive scraping process, where 2905 problems were extracted from LeetCode using Selenium WebDriver and BeautifulSoup in Python. To ensure the data's cleanliness and usability, Natural Language Toolkit (NLTK) text processing libraries were employed for processing and cleaning the scraped information.

The core of the project revolves around the implementation of the Term Frequency-Inverse Document Frequency (TF-IDF) algorithm, enabling efficient search functionality for the scraped DSA problems. By utilizing TF-IDF, the search engine determines the relevance of a query to each document in the database.

Cosine Similarity is applied to find the most relevant search results by measuring the angle between the query vector and each document vector. This approach guarantees accurate and reliable results, highlighting the most pertinent solutions for a given query.

To provide a seamless user experience, the frontend and backend components are integrated using Node.js, Express, and EJS. This integration allows users to interact with the search engine through an intuitive and user-friendly web interface. The application has been successfully deployed using Render, ensuring accessibility to users.

By adding this project to my GitHub repository, I aim to showcase my expertise in web scraping, text processing, algorithm implementation, and frontend-backend integration. It demonstrates my ability to build efficient and user-centric search engines while leveraging a range of technologies and techniques.
