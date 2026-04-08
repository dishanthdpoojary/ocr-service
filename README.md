# 🧾 OCR Service API

A simple and efficient OCR (Optical Character Recognition) microservice built using Node.js. This service allows users to upload images and extract text using OCR technology.

---

## 🚀 Features

* 📤 Upload image files for text extraction
* 🔍 Extract text using OCR (Tesseract)
* ⚡ Fast and lightweight API
* 🔗 Easy to integrate with any frontend or system

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express
* **OCR Engine:** Tesseract.js
* **File Handling:** Multer

---

## 📁 Project Structure

```
ocr-service/
│── node_modules/
│── uploads/           # Uploaded images
│── server.js          # Main server file
│── package.json       # Dependencies and scripts
│── .gitignore
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/dishanthdpoojary/ocr-service.git
cd ocr-service
```

### 2. Install dependencies

```
npm install
```

### 3. Run the server

```
node server.js
```

Server will start at:

```
http://localhost:3000
```

---

## 📡 API Endpoint

### 🔹 Upload Image & Extract Text

**POST** `/ocr`

#### Request:

* Form-data:

  * `image` → Upload image file

#### Response:

```
{
  "text": "Extracted text from the image"
}
```

---

## 🧪 Example Usage (cURL)

```
curl -X POST http://localhost:3000/ocr \
-F "image=@sample.png"
```

---

## ⚠️ Limitations

* No image preprocessing (may affect accuracy)
* Supports basic OCR only
* No async processing (large files may be slow)
* No frontend interface

---

## 🚀 Future Improvements

* Image preprocessing using OpenCV
* Support for PDF documents
* Multi-language OCR
* Frontend UI for easy interaction
* Async job queue for scalability
* AI-based text summarization

---

## 💡 Use Cases

* Document digitization
* Invoice processing
* Text extraction from images
* Automation workflows

---

## 🤝 Contributing

Feel free to fork this repo and submit pull requests for improvements.

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 👨‍💻 Author

**Dishanth D Poojary**
