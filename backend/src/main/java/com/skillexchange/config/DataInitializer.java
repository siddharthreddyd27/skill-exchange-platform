package com.skillexchange.config;

import com.skillexchange.entity.*;
import com.skillexchange.entity.enums.*;
import com.skillexchange.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final UserSkillRepository userSkillRepository;
    private final ConnectionRequestRepository connectionRequestRepository;
    private final SkillExchangeRepository skillExchangeRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(SkillRepository skillRepository,
                           UserRepository userRepository,
                           UserSkillRepository userSkillRepository,
                           ConnectionRequestRepository connectionRequestRepository,
                           SkillExchangeRepository skillExchangeRepository,
                           PasswordEncoder passwordEncoder) {
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
        this.userSkillRepository = userSkillRepository;
        this.connectionRequestRepository = connectionRequestRepository;
        this.skillExchangeRepository = skillExchangeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        try {
            seedSkills();
            seedUsersAndExchanges();
        } catch (Exception ex) {
            logger.warn("Initial data seeding skipped or partially completed: {}", ex.getMessage());
        }
    }

    private void seedSkills() {
        if (skillRepository.count() > 0) {
            return;
        }

        logger.info("Seeding initial skills catalog...");

        List<Skill> initialSkills = List.of(
                new Skill("Java Spring Boot", "Programming", "Enterprise backend development with Spring Boot, JPA, Security, and REST APIs."),
                new Skill("React.js", "Programming", "Modern frontend web development with React, Hooks, Tailwind CSS, and state management."),
                new Skill("Python", "Programming", "Python scripting, data analysis, automation, and backend development with FastAPI/Flask."),
                new Skill("UI/UX Design", "Design", "User interface and experience design using Figma, wireframing, and user research."),
                new Skill("Spanish Language", "Language", "Conversational Spanish, grammar, and vocabulary for travel and everyday life."),
                new Skill("Acoustic Guitar", "Music", "Acoustic guitar chord progressions, fingerpicking techniques, and song accompaniment."),
                new Skill("Docker & DevOps", "Programming", "Containerization with Docker, CI/CD pipelines, and cloud deployment basics."),
                new Skill("Digital Photography", "Creative", "DSLR/Mirrorless camera basics, composition, lighting, and Adobe Lightroom editing."),
                new Skill("Machine Learning", "Programming", "Supervised and unsupervised learning with scikit-learn and PyTorch basics."),
                new Skill("Public Speaking", "Business", "Presentation skills, confidence building, speech structure, and storytelling."),
                new Skill("French Language", "Language", "French pronunciation, conversation, and practical language immersion."),
                new Skill("Chess Tactics", "Strategy", "Opening principles, middle game calculation, and endgame fundamentals.")
        );

        skillRepository.saveAll(initialSkills);
        logger.info("Successfully seeded {} skills.", initialSkills.size());
    }

    private void seedUsersAndExchanges() {
        if (userRepository.count() > 0) {
            return;
        }

        logger.info("Seeding demo users, skills, and sample exchanges...");

        String defaultPass = passwordEncoder.encode("Password@123");

        // User 1: Demo User (logged in user showcase)
        User user1 = new User("demouser", "demo@skillexchange.io", defaultPass, "Alex Morgan");
        user1.setBio("Full-stack engineer passionate about teaching web development and learning languages and music.");
        user1.setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256");
        user1.setInterests("Web Dev, Open Source, Indie Hacking, Spanish, Guitar");
        user1.setLocation("San Francisco, CA");
        user1 = userRepository.save(user1);

        // User 2: Sophia Chen (Design & Guitar teacher)
        User user2 = new User("sophiac", "sophia@skillexchange.io", defaultPass, "Sophia Chen");
        user2.setBio("Senior Product Designer at a tech startup. Loves sketching, playing acoustic guitar, and learning backend APIs.");
        user2.setAvatarUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256");
        user2.setInterests("Figma, UI Systems, Acoustic Guitar, Java, Travel");
        user2.setLocation("Seattle, WA");
        user2 = userRepository.save(user2);

        // User 3: Carlos Mendoza (Spanish & Photography)
        User user3 = new User("carlosm", "carlos@skillexchange.io", defaultPass, "Carlos Mendoza");
        user3.setBio("Native Spanish speaker from Madrid. Freelance travel photographer. Keen to learn React and modern web development.");
        user3.setAvatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256");
        user3.setInterests("Spanish Culture, Photography, React, Web Development");
        user3.setLocation("Madrid, Spain");
        user3 = userRepository.save(user3);

        // User 4: Priya Sharma (Python & ML expert)
        User user4 = new User("priyas", "priya@skillexchange.io", defaultPass, "Priya Sharma");
        user4.setBio("Data Scientist working with Python and ML. Wanting to learn UI/UX design to build prettier dashboard prototypes.");
        user4.setAvatarUrl("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256");
        user4.setInterests("Python, Data Science, UI/UX, Public Speaking");
        user4.setLocation("Austin, TX");
        user4 = userRepository.save(user4);

        // Fetch skills for linking
        Skill javaSkill = skillRepository.findByNameIgnoreCase("Java Spring Boot").orElse(null);
        Skill reactSkill = skillRepository.findByNameIgnoreCase("React.js").orElse(null);
        Skill uiSkill = skillRepository.findByNameIgnoreCase("UI/UX Design").orElse(null);
        Skill spanishSkill = skillRepository.findByNameIgnoreCase("Spanish Language").orElse(null);
        Skill guitarSkill = skillRepository.findByNameIgnoreCase("Acoustic Guitar").orElse(null);
        Skill pythonSkill = skillRepository.findByNameIgnoreCase("Python").orElse(null);

        if (javaSkill != null && reactSkill != null && uiSkill != null && spanishSkill != null && guitarSkill != null && pythonSkill != null) {
            // User 1 skills: Teaches Java & React, wants to learn Spanish & Guitar
            userSkillRepository.save(new UserSkill(user1, javaSkill, SkillType.TEACH, ProficiencyLevel.EXPERT, "Building production REST services with Spring Boot and JPA", 5));
            userSkillRepository.save(new UserSkill(user1, reactSkill, SkillType.TEACH, ProficiencyLevel.ADVANCED, "Modern React hooks, component architecture, and responsive styling", 4));
            userSkillRepository.save(new UserSkill(user1, spanishSkill, SkillType.LEARN, ProficiencyLevel.BEGINNER, "Looking to learn conversational Spanish for an upcoming trip", null));
            userSkillRepository.save(new UserSkill(user1, guitarSkill, SkillType.LEARN, ProficiencyLevel.BEGINNER, "Want to learn basic chords and strumming patterns", null));

            // User 2 (Sophia) skills: Teaches UI/UX & Guitar, wants to learn Java Spring Boot & React
            userSkillRepository.save(new UserSkill(user2, uiSkill, SkillType.TEACH, ProficiencyLevel.EXPERT, "Design systems, typography, Figma workflows and wireframes", 6));
            userSkillRepository.save(new UserSkill(user2, guitarSkill, SkillType.TEACH, ProficiencyLevel.ADVANCED, "Acoustic fingerstyle and rhythm guitar for pop and folk songs", 7));
            userSkillRepository.save(new UserSkill(user2, javaSkill, SkillType.LEARN, ProficiencyLevel.BEGINNER, "Want to understand backend APIs to collaborate better with engineers", null));

            // User 3 (Carlos) skills: Teaches Spanish, wants to learn React
            userSkillRepository.save(new UserSkill(user3, spanishSkill, SkillType.TEACH, ProficiencyLevel.EXPERT, "Native Castilian Spanish, conversational fluency and grammar", 10));
            userSkillRepository.save(new UserSkill(user3, reactSkill, SkillType.LEARN, ProficiencyLevel.INTERMEDIATE, "Building a portfolio gallery website for photography work", null));

            // User 4 (Priya) skills: Teaches Python, wants to learn UI/UX
            userSkillRepository.save(new UserSkill(user4, pythonSkill, SkillType.TEACH, ProficiencyLevel.EXPERT, "Python data structures, pandas, automation and clean coding", 6));
            userSkillRepository.save(new UserSkill(user4, uiSkill, SkillType.LEARN, ProficiencyLevel.BEGINNER, "Visual hierarchy and dashboard layout design principles", null));

            // Connection: Alex (user1) and Carlos (user3) are connected!
            ConnectionRequest conn1 = new ConnectionRequest(user3, user1, "Hola Alex! I saw you build React apps. I'd love to help you with your Spanish in exchange for React mentoring!");
            conn1.setStatus(ConnectionStatus.ACCEPTED);
            conn1.setRespondedAt(java.time.LocalDateTime.now());
            connectionRequestRepository.save(conn1);

            // Connection: Sophia (user2) sent pending request to Alex
            ConnectionRequest conn2 = new ConnectionRequest(user2, user1, "Hey Alex, I'd love to swap Guitar lessons for some Java Spring Boot fundamentals!");
            conn2.setStatus(ConnectionStatus.PENDING);
            connectionRequestRepository.save(conn2);

            // Active Skill Exchange between Alex and Carlos
            SkillExchange exchange1 = new SkillExchange(
                    user3,
                    user1,
                    spanishSkill,
                    reactSkill,
                    "Spanish Conversation & React Portfolio Swap",
                    "Weekly 45-min Spanish conversation practice followed by 45-min React code review and component building.",
                    "Every Thursday at 6:00 PM CET / 9:00 AM PST"
            );
            exchange1.setStatus(ExchangeStatus.IN_PROGRESS);
            exchange1.setNotes("Week 1 completed: practiced greetings and set up Carlos's Vite React project!");
            skillExchangeRepository.save(exchange1);
        }

        logger.info("Demo data setup completed successfully!");
    }
}
