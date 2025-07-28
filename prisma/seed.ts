import { PrismaClient, Subject, Difficulty, QuestionType, AdminRole } from '@prisma/client'
import * as argon2 from 'argon2' // Changed from bcryptjs to argon2

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding question system...')

  // Check if admin exists (from your existing create-admin script)
  const existingAdmin = await prisma.admin.findFirst({
    where: { role: AdminRole.SUPER_ADMIN }
  })

  let adminId = existingAdmin?.id

  // Create default admin if none exists
  if (!adminId) {
    const hashedPassword = await argon2.hash('admin123') // Using argon2.hash instead of bcrypt.hash
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        email: 'admin@example.com', // Fixed: removed extra quote
        password: hashedPassword,
        role: AdminRole.SUPER_ADMIN,
      },
    })
    adminId = admin.id
    console.log('✅ Created admin user')
  }

  // Create default tags
  const tags = [
    { name: 'algebra', color: '#FF6B6B' },
    { name: 'geometry', color: '#4ECDC4' },
    { name: 'calculus', color: '#45B7D1' },
    { name: 'physics', color: '#96CEB4' },
    { name: 'chemistry', color: '#FFEAA7' },
    { name: 'biology', color: '#DDA0DD' },
    { name: 'reasoning', color: '#98D8C8' },
    { name: 'verbal', color: '#F7DC6F' },
    { name: 'quantitative', color: '#BB8FCE' },
    { name: 'basic', color: '#85C1E9' },
    { name: 'intermediate', color: '#F8C471' },
    { name: 'advanced', color: '#EC7063' },
  ]

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: tag,
    })
  }
  console.log('✅ Created default tags')

  // Create Question Banks (using findFirst + create to handle null subcategory)
  const questionBanks = [
    { name: 'CAT Quantitative Ability', subject: Subject.CAT, category: 'Quantitative Ability', subcategory: null },
    { name: 'CAT Verbal Ability', subject: Subject.CAT, category: 'Verbal Ability', subcategory: null },
    { name: 'CAT Data Interpretation', subject: Subject.CAT, category: 'Data Interpretation & Logical Reasoning', subcategory: null },
    { name: 'JEE Physics', subject: Subject.JEE_MAIN, category: 'Physics', subcategory: null },
    { name: 'JEE Chemistry', subject: Subject.JEE_MAIN, category: 'Chemistry', subcategory: null },
    { name: 'JEE Mathematics', subject: Subject.JEE_MAIN, category: 'Mathematics', subcategory: null },
  ]

  for (const bank of questionBanks) {
    const existingBank = await prisma.questionBank.findFirst({
      where: {
        subject: bank.subject,
        category: bank.category,
        subcategory: bank.subcategory
      }
    });

    if (!existingBank) {
      await prisma.questionBank.create({
        data: {
          name: bank.name,
          subject: bank.subject,
          category: bank.category,
          subcategory: bank.subcategory
        }
      });
    }
  }
  console.log('✅ Created question banks')

  // Create CAT exam template
  const existingTemplate = await prisma.examTemplate.findFirst({
    where: { name: 'CAT Standard Pattern' }
  })

  if (!existingTemplate) {
    const catTemplate = await prisma.examTemplate.create({
      data: {
        name: 'CAT Standard Pattern',
        subject: Subject.CAT,
        description: 'Standard CAT exam pattern with 3 sections',
        totalTime: 120, // 2 hours
        allowBackward: true,
        showTimer: true,
        instructions: 'This is a Computer Adaptive Test. Read all instructions carefully.',
        sections: {
          create: [
            {
              name: 'Quantitative Ability',
              order: 1,
              timeLimit: 40,
              lockAfterTime: 40,
              totalQuestions: 22,
              easyCount: 6,
              mediumCount: 10,
              hardCount: 6,
              expertCount: 0,
              instructions: 'Answer all questions in this section.',
            },
            {
              name: 'Data Interpretation & Logical Reasoning',
              order: 2,
              timeLimit: 40,
              lockAfterTime: 40,
              totalQuestions: 20,
              easyCount: 5,
              mediumCount: 10,
              hardCount: 5,
              expertCount: 0,
              instructions: 'Analyze the data carefully before answering.',
            },
            {
              name: 'Verbal Ability & Reading Comprehension',
              order: 3,
              timeLimit: 40,
              lockAfterTime: null, // No lock for last section
              totalQuestions: 24,
              easyCount: 8,
              mediumCount: 12,
              hardCount: 4,
              expertCount: 0,
              instructions: 'Read the passages carefully.',
            },
          ],
        },
      },
    })
    console.log('✅ Created CAT exam template')
  }

  // Create sample questions
  const sampleQuestions = [
    {
      content: 'What is the value of √144?',
      questionType: QuestionType.MCQ_SINGLE,
      options: ['10', '11', '12', '13'],
      correctAnswer: 'C',
      explanation: '√144 = 12 because 12² = 144',
      subject: Subject.CAT,
      category: 'Quantitative Ability',
      subcategory: 'Arithmetic',
      difficulty: Difficulty.EASY,
      estimatedTime: 60,
      createdById: adminId,
    },
    {
      content: 'If x + y = 10 and x - y = 2, what is the value of x?',
      questionType: QuestionType.MCQ_SINGLE,
      options: ['4', '5', '6', '7', '8'],
      correctAnswer: 'C',
      explanation: 'Adding the equations: 2x = 12, so x = 6',
      subject: Subject.CAT,
      category: 'Quantitative Ability',
      subcategory: 'Algebra',
      difficulty: Difficulty.MEDIUM,
      estimatedTime: 90,
      createdById: adminId,
    }
  ]

  for (const questionData of sampleQuestions) {
    const existingQuestion = await prisma.question.findFirst({
      where: { content: questionData.content }
    })

    if (!existingQuestion) {
      const question = await prisma.question.create({
        data: questionData,
      })

      // Add to question bank
      const bank = await prisma.questionBank.findFirst({
        where: {
          subject: questionData.subject,
          category: questionData.category,
        },
      })

      if (bank) {
        await prisma.questionBankQuestion.create({
          data: {
            questionId: question.id,
            questionBankId: bank.id,
          },
        })
      }
    }
  }

  console.log('✅ Created sample questions')
  console.log('🎉 Question system seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
