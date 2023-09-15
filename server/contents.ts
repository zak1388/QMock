import z from 'zod';

// Predicted Paper Generation Pipeline
// 1. Collate all questions from past papers for a given module
// 2. Identify the module content by listing the topic and subtopics using the following schema:
/*
    moduleContent = {
        topic: string,
        subtopics: moduleContent[]
    }
*/
// 3. For all topics and subtopics, collate all questions from past papers for that topic/subtopic
// 4. Find the average number of questions per past paper for each topic/subtopic
// 5. For each topic/subtopic, generate n questions where n is the average number of questions per past paper for that topic/subtopic using OpenAI completions API, using the following schema:
/*
    question = {
        topic: string,
        question: string,
        answer: string
    }
*/