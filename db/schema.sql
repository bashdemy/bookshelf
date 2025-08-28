-- Bookshelf Database Schema
-- Enhanced for data analysis, diagrams, and personal tracking

-- ========================================
-- CORE TABLES
-- ========================================

-- Books table with enhanced tracking
CREATE TABLE IF NOT EXISTS books (
    id TEXT PRIMARY KEY, -- UUID
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'to-read' CHECK (status IN ('to-read', 'reading', 'completed', 'abandoned')),
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    pages INTEGER CHECK (pages > 0),
    genre TEXT,
    isbn TEXT,
    publisher TEXT,
    publication_year INTEGER CHECK (publication_year > 1800 AND publication_year <= 2100),
    language TEXT DEFAULT 'en' CHECK (language IN ('en', 'ru')),
    format TEXT CHECK (format IN ('physical', 'ebook', 'audiobook', 'pdf')),
    source TEXT, -- where you got the book (library, purchase, gift, etc.)
    purchase_price_cents INTEGER, -- stored as cents to avoid decimal precision issues
    purchase_date TEXT, -- ISO date format
    start_date TEXT, -- when you started reading
    finish_date TEXT, -- when you finished reading
    reading_time_hours INTEGER, -- total time spent reading
    re_read_count INTEGER DEFAULT 0,
    is_favorite INTEGER DEFAULT 0, -- SQLite boolean as 0/1
    is_recommended INTEGER DEFAULT 0, -- SQLite boolean as 0/1
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    created_by TEXT DEFAULT 'system',
    updated_by TEXT DEFAULT 'system'
);

-- Articles table with enhanced tracking
CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY, -- UUID
    title TEXT NOT NULL,
    url TEXT NOT NULL, -- URL is now required for articles
    author TEXT,
    publication TEXT,
    summary TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'to-read' CHECK (status IN ('to-read', 'reading', 'completed', 'archived')),
    word_count INTEGER,
    reading_time_minutes INTEGER,
    source TEXT, -- where you found the article
    category TEXT, -- news, research, tutorial, etc.
    importance_level INTEGER CHECK (importance_level >= 1 AND importance_level <= 5),
    is_bookmarked INTEGER DEFAULT 0, -- SQLite boolean as 0/1
    is_shared INTEGER DEFAULT 0, -- SQLite boolean as 0/1
    share_date TEXT,
    start_date TEXT, -- when you started reading
    finish_date TEXT, -- when you finished reading
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    created_by TEXT DEFAULT 'system',
    updated_by TEXT DEFAULT 'system'
);

-- ========================================
-- ENHANCED TRACKING TABLES
-- ========================================

-- Personal comments and reflections
CREATE TABLE IF NOT EXISTS personal_comments (
    id TEXT PRIMARY KEY, -- UUID
    book_id TEXT,
    article_id TEXT,
    comment_type TEXT NOT NULL CHECK (comment_type IN ('reflection', 'quote', 'insight', 'question', 'criticism', 'praise')),
    content TEXT NOT NULL,
    page_number INTEGER, -- for books
    chapter TEXT, -- for books
    is_public INTEGER DEFAULT 0, -- SQLite boolean as 0/1
    mood TEXT, -- how you felt while reading this
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    CHECK ((book_id IS NOT NULL AND article_id IS NULL) OR (book_id IS NULL AND article_id IS NOT NULL))
);

-- ========================================
-- ANALYTICS AND DIAGRAM TABLES
-- ========================================

-- Reading goals and targets
CREATE TABLE IF NOT EXISTS reading_goals (
    id TEXT PRIMARY KEY, -- UUID
    year INTEGER NOT NULL,
    goal_type TEXT NOT NULL CHECK (goal_type IN ('books', 'pages', 'hours', 'articles')),
    target_value INTEGER NOT NULL,
    current_value INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1, -- SQLite boolean as 0/1
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Reading streaks and habits
CREATE TABLE IF NOT EXISTS reading_streaks (
    id TEXT PRIMARY KEY, -- UUID
    streak_date TEXT NOT NULL UNIQUE,
    books_read INTEGER DEFAULT 0,
    articles_read INTEGER DEFAULT 0,
    total_pages INTEGER DEFAULT 0,
    total_minutes INTEGER DEFAULT 0,
    mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ========================================
-- RELATIONSHIP TABLES
-- ========================================

-- Tags for better categorization (normalized approach)
CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY, -- UUID
    name TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT '#3B82F6',
    description TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Book-Tag relationships
CREATE TABLE IF NOT EXISTS book_tags (
    book_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (book_id, tag_id),
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Article-Tag relationships
CREATE TABLE IF NOT EXISTS article_tags (
    article_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (article_id, tag_id),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- ========================================
-- AUDIT AND METADATA TABLES
-- ========================================

-- System configuration and metadata
CREATE TABLE IF NOT EXISTS system_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Data import/export history
CREATE TABLE IF NOT EXISTS data_operations (
    id TEXT PRIMARY KEY, -- UUID
    operation_type TEXT NOT NULL CHECK (operation_type IN ('import', 'export', 'backup', 'migration')),
    filename TEXT,
    records_processed INTEGER,
    status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'partial')),
    error_message TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Books indexes
CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_books_genre ON books(genre);
CREATE INDEX IF NOT EXISTS idx_books_rating ON books(rating);
CREATE INDEX IF NOT EXISTS idx_books_created_at ON books(created_at);
CREATE INDEX IF NOT EXISTS idx_books_finish_date ON books(finish_date);

-- Articles indexes
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at);
CREATE INDEX IF NOT EXISTS idx_articles_finish_date ON articles(finish_date);



-- Personal comments indexes
CREATE INDEX IF NOT EXISTS idx_personal_comments_book_id ON personal_comments(book_id);
CREATE INDEX IF NOT EXISTS idx_personal_comments_article_id ON personal_comments(article_id);
CREATE INDEX IF NOT EXISTS idx_personal_comments_type ON personal_comments(comment_type);

-- Tag indexes
CREATE INDEX IF NOT EXISTS idx_book_tags_book_id ON book_tags(book_id);
CREATE INDEX IF NOT EXISTS idx_book_tags_tag_id ON book_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_article_tags_article_id ON article_tags(article_id);
CREATE INDEX IF NOT EXISTS idx_article_tags_tag_id ON article_tags(tag_id);

-- Reading streaks indexes
CREATE INDEX IF NOT EXISTS idx_reading_streaks_date ON reading_streaks(streak_date);

-- ========================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ========================================

-- Update updated_at timestamp for books
CREATE TRIGGER IF NOT EXISTS update_books_updated_at
    AFTER UPDATE ON books
    FOR EACH ROW
BEGIN
    UPDATE books SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Update updated_at timestamp for articles
CREATE TRIGGER IF NOT EXISTS update_articles_updated_at
    AFTER UPDATE ON articles
    FOR EACH ROW
BEGIN
    UPDATE articles SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Update updated_at timestamp for personal comments
CREATE TRIGGER IF NOT EXISTS update_personal_comments_updated_at
    AFTER UPDATE ON personal_comments
    FOR EACH ROW
BEGIN
    UPDATE personal_comments SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- ========================================
-- INITIAL DATA
-- ========================================

-- Insert default tags (using UUIDs)
INSERT OR IGNORE INTO tags (id, name, color, description) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'fiction', '#EF4444', 'Fictional literature'),
    ('550e8400-e29b-41d4-a716-446655440002', 'non-fiction', '#10B981', 'Non-fictional works'),
    ('550e8400-e29b-41d4-a716-446655440003', 'science', '#3B82F6', 'Scientific literature'),
    ('550e8400-e29b-41d4-a716-446655440004', 'technology', '#8B5CF6', 'Technology and programming'),
    ('550e8400-e29b-41d4-a716-446655440005', 'philosophy', '#F59E0B', 'Philosophical works'),
    ('550e8400-e29b-41d4-a716-446655440006', 'psychology', '#EC4899', 'Psychology and mental health'),
    ('550e8400-e29b-41d4-a716-446655440007', 'classics', '#8B5CF6', 'Classical literature'),
    ('550e8400-e29b-41d4-a716-446655440008', 'history', '#6B7280', 'Historical works'),
    ('550e8400-e29b-41d4-a716-446655440009', 'biography', '#F97316', 'Biographies and memoirs'),
    ('550e8400-e29b-41d4-a716-446655440010', 'self-help', '#84CC16', 'Self-help and personal development'),
    ('550e8400-e29b-41d4-a716-446655440011', 'business', '#F59E0B', 'Business and economics'),
    ('550e8400-e29b-41d4-a716-446655440012', 'art', '#06B6D4', 'Art and creativity');

-- Insert default system configuration
INSERT OR IGNORE INTO system_config (key, value, description) VALUES
    ('schema_version', '1.0.0', 'Current database schema version'),
    ('default_language', 'en', 'Default language for books'),
    ('default_format', 'physical', 'Default book format'),

    ('enable_personal_comments', 'true', 'Enable personal comments and reflections'),
    ('enable_reading_goals', 'true', 'Enable reading goals and targets'),
    ('enable_reading_streaks', 'true', 'Enable reading streak tracking');

-- ========================================
-- VIEWS FOR COMMON QUERIES
-- ========================================

-- Books with reading statistics
CREATE VIEW IF NOT EXISTS books_with_stats AS
SELECT 
    b.*,
    COUNT(pc.id) as comment_count
FROM books b
LEFT JOIN personal_comments pc ON b.id = pc.book_id
GROUP BY b.id;

-- Articles with reading statistics
CREATE VIEW IF NOT EXISTS articles_with_stats AS
SELECT 
    a.*,
    COUNT(pc.id) as comment_count
FROM articles a
LEFT JOIN personal_comments pc ON a.id = pc.article_id
GROUP BY a.id;

-- Monthly reading summary
CREATE VIEW IF NOT EXISTS monthly_reading_summary AS
SELECT 
    strftime('%Y-%m', b.finish_date) as month,
    COUNT(DISTINCT b.id) as books_read,
    0 as articles_read,
    0 as total_minutes,
    SUM(b.pages) as total_pages
FROM books b
WHERE b.finish_date IS NOT NULL
GROUP BY strftime('%Y-%m', b.finish_date)
UNION ALL
SELECT 
    strftime('%Y-%m', a.finish_date) as month,
    0 as books_read,
    COUNT(DISTINCT a.id) as articles_read,
    0 as total_minutes,
    0 as total_pages
FROM articles a
WHERE a.finish_date IS NOT NULL
GROUP BY strftime('%Y-%m', a.finish_date)
ORDER BY month DESC;

-- Books with tags view
CREATE VIEW IF NOT EXISTS books_with_tags AS
SELECT 
    b.*,
    GROUP_CONCAT(t.name, ', ') as tag_names
FROM books b
LEFT JOIN book_tags bt ON b.id = bt.book_id
LEFT JOIN tags t ON bt.tag_id = t.id
GROUP BY b.id;

-- Articles with tags view
CREATE VIEW IF NOT EXISTS articles_with_tags AS
SELECT 
    a.*,
    GROUP_CONCAT(t.name, ', ') as tag_names
FROM articles a
LEFT JOIN article_tags at ON a.id = at.article_id
LEFT JOIN tags t ON at.tag_id = t.id
GROUP BY a.id;

-- ========================================
-- COMMENTS AND DOCUMENTATION
-- ========================================

/*
This schema is designed for a comprehensive bookshelf application with the following features:

1. CORE FUNCTIONALITY:
   - Books and articles tracking with UUID primary keys
   - Reading status management
   - Rating and review system
   - Genre and category classification
   - Normalized tag system (no duplicate tag storage)

2. ENHANCED TRACKING:
   - Personal comments and reflections
   - Reading goals and targets
   - Reading streaks and habits

3. ANALYTICS AND DIAGRAMS:
   - Monthly reading summaries
   - Reading statistics and trends
   - Performance tracking
   - Data visualization support

4. DATA INTEGRITY:
   - UUID primary keys for security and unpredictability
   - Foreign key constraints
   - Check constraints for data validation
   - Automatic timestamp updates
   - Audit trails
   - Money stored as cents (INTEGER) to avoid decimal precision issues
   - Consistent boolean representation as 0/1 INTEGER

5. PERFORMANCE:
   - Strategic indexing
   - Optimized views for common queries
   - Efficient data retrieval
   - Tag relationships properly indexed

6. SECURITY:
   - Non-predictable UUIDs for all primary keys
   - Safe for public APIs
   - No sensitive data exposure through sequential IDs

The schema supports building various diagrams including:
- Reading progress over time
- Genre distribution
- Author analysis
- Reading habits and streaks
- Goal tracking and achievement
- Personal insights and reflections
- Tag-based categorization analysis

IMPORTANT NOTES:
- All IDs are UUIDs (TEXT) for security
- Money values stored as cents (INTEGER)
- Booleans stored as 0/1 INTEGER
- Tags are normalized (no duplicate storage)
- Foreign keys must be enabled in application code
*/
