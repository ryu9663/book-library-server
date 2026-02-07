import { Book } from 'src/book/entities/book.entity';

export const mockBooks = [
  {
    id: 1,
    title: '해리포터',
    author: 'J.K. 롤링',
    isbn: '9788983927620',
    isAvailable: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    thumbnail: 'https://covers.openlibrary.org/b/isbn/9788983927620-M.jpg',
    loans: [],
  },
  {
    id: 2,
    title: '반지의 제왕',
    author: '톨킨',
    isbn: '9780261102163',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    isAvailable: true,
    thumbnail: 'https://covers.openlibrary.org/b/isbn/9780261102163-M.jpg',
    loans: [],
  },
];
