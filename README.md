# Code Summarization for Python

A deep learning-based tool that automatically generates natural language summaries for Python code using a Sequence-to-Sequence (Seq2Seq) model with Attention mechanism.

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-red.svg)](https://pytorch.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📝 Overview

This project implements a **Sequence-to-Sequence (Seq2Seq) model with Attention** for automatic Python code summarization. The model takes Python code as input and produces a concise natural language description of what the code does.

### Example

| Input Code | Generated Summary |
|------------|-------------------|
| `def add(a, b): return a + b` | `adds two numbers` |
| `def multiply(x, y): return x * y` | `multiplies two numbers` |
| `def is_even(n): return n % 2 == 0` | `checks if even` |

---

## 🏗️ Model Architecture

Code Tokens → [Encoder (BiLSTM)] → Hidden States → [Attention] → Context
↓
Summary ← [Decoder (LSTM)] ← Context + Previous Word


| Component | Description |
|-----------|-------------|
| **Encoder** | Bidirectional LSTM (2 layers, 256 hidden units) |
| **Attention** | Bahdanau (additive) attention mechanism |
| **Decoder** | LSTM (2 layers, 256 hidden units) with attention |
| **Tokenization** | CodeBERT tokenizer (`microsoft/codebert-base`) |
| **Total Parameters** | ~6 million |

---

## 📊 Results

| Metric | Score |
|--------|-------|
| **BLEU Score** | 0.532 |
| **ROUGE-1** | 0.738 |
| **ROUGE-2** | 0.626 |
| **ROUGE-L** | 0.728 |
| **Perplexity** | 24.93 |

---

## 📁 Project Structure
code_summarization/
├── 📄 README.md # This file
├── 📄 requirements.txt # Python dependencies
├── 📄 test_dataset.py # Dataset loader test
│
├── 📁 scripts/
│ ├── train.py # Model training
│ ├── evaluate.py # Performance evaluation
│ └── summarize.py # Inference script
│
├── 📁 models/
│ ├── encoder.py # Bidirectional LSTM encoder
│ ├── decoder.py # Attention decoder
│ ├── attention.py # Attention mechanism
│ └── seq2seq.py # Seq2Seq wrapper
│
├── 📁 src/
│ ├── data_loader.py # Dataset & tokenizer
│ └── data_preprocessing.py # Text cleaning
│
├── 📁 api/
│ └── main.py # FastAPI server
│
├── 📁 frontend/
│ ├── index.html # Web interface
│ ├── style.css # Styling
│ └── script.js # JavaScript logic
