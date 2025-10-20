import EntryCard from '@/components/EntryCard';
import NewEntryCard from '@/components/NewEntryCard';
import { analyze } from '@/utils/ai';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import Link from 'next/link';

const getEntries = async () => {
    const user = await getUserByClerkId();
    const entries = await prisma.journalEntry.findMany({
        where: {
            userId: user.id,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // Example journal entry for analysis
    const exampleEntry = `
        Today was a really great day. I went to the park and enjoyed the sunshine. I felt so happy and relaxed being outdoors.
        I also met my best friend Shraddha after a long time. We had ice cream and talked for hours.
    `;

    try {
        const analysis = await analyze(exampleEntry);
        console.log('Gemini analysis:', analysis);
    } catch (err) {
        console.error('Gemini analysis error:', err);
    }

    return entries;
};

const JournalPage = async () => {
    const entries = await getEntries();
    return (
        <div className='p-10 bg-zinc-400/10 h-full'>
            <h2 className='text-3xl mb-8'>Journal</h2>
            <div className='grid grid-cols-3 gap-4 p-10 '>
                <NewEntryCard />
                {entries.map(entry => (
                    <Link href={`/journal/${entry.id}`} key={entry.id}>
                        <EntryCard entry={entry} />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default JournalPage;