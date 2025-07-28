-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for call center agents
CREATE TABLE agents (
    agent_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,--column added 
    team VARCHAR(100),
    hire_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for customers
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    identifier VARCHAR(255) UNIQUE NOT NULL, -- Masked phone number or a unique ID
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for products offered
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100)
);

-- Central table for all call records
CREATE TABLE calls (
    call_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id INT REFERENCES agents(agent_id),
    customer_id INT REFERENCES customers(customer_id),
    call_timestamp TIMESTAMPTZ NOT NULL,
    duration_seconds INT NOT NULL,
    direction VARCHAR(10) CHECK (direction IN ('inbound', 'outbound')),
    outcome VARCHAR(50), -- e.g., 'Resolved', 'Escalated', 'Unresolved'
    customer_sentiment VARCHAR(50), -- e.g., 'Positive', 'Neutral', 'Negative'
    agent_sentiment VARCHAR(50), -- e.g., 'Empathetic', 'Neutral', 'Frustrated'
    flagged_for_review BOOLEAN DEFAULT FALSE,
    summary TEXT,
    next_action TEXT,
    contains_sensitive_info BOOLEAN DEFAULT FALSE,
    transcript_available BOOLEAN DEFAULT FALSE,
    agent_talk_time_seconds INT,
    customer_talk_time_seconds INT,
    silence_duration_seconds INT,
    interruptions INT,
    compliance_score NUMERIC(5, 2), -- Score from 0.00 to 100.00
    audio_recording_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for individual transcript entries of a call
CREATE TABLE transcripts (
    transcript_id BIGSERIAL PRIMARY KEY,
    call_id UUID NOT NULL REFERENCES calls(call_id) ON DELETE CASCADE,
    speaker VARCHAR(10) CHECK (speaker IN ('agent', 'customer')),
    speaker_name VARCHAR(255),
    timestamp_in_call_seconds INT NOT NULL,
    original_text TEXT NOT NULL,
    translated_text TEXT,
    is_sensitive BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table to define all possible topics/keywords
CREATE TABLE topics (
    topic_id SERIAL PRIMARY KEY,
    name_en VARCHAR(255) UNIQUE NOT NULL,
    name_ur VARCHAR(255) UNIQUE,
    category VARCHAR(100) -- e.g., 'Growth Opportunity', 'Complaint', 'Risk Indicator'
);

-- Junction table for topics mentioned in a call (many-to-many)
CREATE TABLE call_topics (
    call_topic_id SERIAL PRIMARY KEY,
    call_id UUID NOT NULL REFERENCES calls(call_id) ON DELETE CASCADE,
    topic_id INT NOT NULL REFERENCES topics(topic_id),
    mention_count INT DEFAULT 1,
    UNIQUE(call_id, topic_id)
);

-- Table for specific tags on transcript entries
CREATE TABLE transcript_tags (
    tag_id BIGSERIAL PRIMARY KEY,
    transcript_id BIGINT NOT NULL REFERENCES transcripts(transcript_id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- e.g., 'compliance', 'sentiment', 'action_item'
    text VARCHAR(255) NOT NULL,
    variant VARCHAR(50), -- For UI styling, e.g., 'destructive', 'outline'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for script adherence scores per call
CREATE TABLE script_adherence (
    adherence_id SERIAL PRIMARY KEY,
    call_id UUID NOT NULL REFERENCES calls(call_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id),
    score NUMERIC(5, 2) NOT NULL, -- Score from 0.00 to 100.00
    trend_from_previous NUMERIC(5, 2),
    top_missed_area TEXT,
    assessment_date DATE DEFAULT CURRENT_DATE
);

-- Table to log specific points missed during a call for script adherence
CREATE TABLE missed_script_points (
    missed_point_id SERIAL PRIMARY KEY,
    adherence_id INT NOT NULL REFERENCES script_adherence(adherence_id) ON DELETE CASCADE,
    point_description TEXT NOT NULL,
    frequency INT,
    impact TEXT
);

-- Table for agent knowledge scores, assessed periodically
CREATE TABLE product_knowledge_scores (
    score_id SERIAL PRIMARY KEY,
    agent_id INT NOT NULL REFERENCES agents(agent_id),
    product_id INT NOT NULL REFERENCES products(product_id),
    score NUMERIC(5, 2) NOT NULL,
    issues_noted TEXT,
    assessment_date DATE NOT NULL,
    UNIQUE(agent_id, product_id, assessment_date)
);

-- Table for detected environmental factors in a call
CREATE TABLE call_environment_factors (
    factor_id SERIAL PRIMARY KEY,
    call_id UUID NOT NULL REFERENCES calls(call_id) ON DELETE CASCADE,
    noise_type VARCHAR(100) NOT NULL, -- e.g., 'dog_barking', 'cafe_chatter'
    detection_count INT DEFAULT 1,
    confidence_score NUMERIC(3, 2) -- Score from 0.00 to 1.00
);

-- Indexes for performance
CREATE INDEX idx_calls_agent_id ON calls(agent_id);
CREATE INDEX idx_calls_customer_id ON calls(customer_id);
CREATE INDEX idx_calls_call_timestamp ON calls(call_timestamp);
CREATE INDEX idx_transcripts_call_id ON transcripts(call_id);
CREATE INDEX idx_call_topics_call_id ON call_topics(call_id);
CREATE INDEX idx_call_topics_topic_id ON call_topics(topic_id);
CREATE INDEX idx_transcript_tags_transcript_id ON transcript_tags(transcript_id);
CREATE INDEX idx_script_adherence_call_id ON script_adherence(call_id);
CREATE INDEX idx_product_knowledge_scores_agent_id ON product_knowledge_scores(agent_id);
CREATE INDEX idx_product_knowledge_scores_product_id ON product_knowledge_scores(product_id);
CREATE INDEX idx_call_environment_factors_call_id ON call_environment_factors(call_id);
CREATE INDEX idx_agents_email ON agents(email);--this is added
