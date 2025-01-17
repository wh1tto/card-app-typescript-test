import {useState, useContext, ChangeEvent, MouseEvent, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {EntryContext} from '../utilities/globalContext'
import {Entry, EntryContextType} from '../@types/context'

export default function EditEntry() {
    const { id } = useParams();
    const emptyEntry: Entry = { title: '', description: '', created_at: new Date() };

    const { updateEntry, entries } = useContext(EntryContext) as EntryContextType;
    const [newEntry, setNewEntry] = useState<Entry>(emptyEntry);

    useEffect(() => {
        const entry = entries.filter((entry) => entry.id == id)[0];
        setNewEntry(entry);
    }, []);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewEntry({
        ...newEntry,
        [event.target.name]: event.target.value,
        });
    };

    const handleSend = (e: MouseEvent<HTMLButtonElement>) => {
        updateEntry(id as string, newEntry);
    };

    return (
        <section className="flex justify-center flex-col w-fit ml-auto mr-auto mt-10 gap-5 bg-gray-300 dark:bg-gray-800 dark:text-white p-8 rounded-md shadow-lg">
        <input
            className="p-3 rounded-md bg-white dark:bg-gray-700 dark:text-white border dark:border-gray-600"
            type="text"
            placeholder="Title"
            name="title"
            value={newEntry.title}
            onChange={handleInputChange}
        />
        <textarea
            className="p-3 rounded-md bg-white dark:bg-gray-700 dark:text-white border dark:border-gray-600"
            placeholder="Description"
            name="description"
            value={newEntry.description}
            onChange={handleInputChange}
        />
        <input
            className="p-3 rounded-md bg-white dark:bg-gray-700 dark:text-white border dark:border-gray-600"
            type="date"
            name="created_at"
            value={new Date(newEntry.created_at).toISOString().split('T')[0]}
            onChange={handleInputChange}
        />
        <button
            onClick={(e) => {
            handleSend(e);
            }}
            className="bg-blue-400 dark:bg-blue-700 hover:bg-blue-600 dark:hover:bg-blue-800 font-semibold text-white p-3 rounded-md transition-colors"
        >
            Update
        </button>
        </section>
    );
}
