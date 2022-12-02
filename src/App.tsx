import Santa from './assets/santa.png';
import { createContext, useContext, useMemo, useState } from 'react';

type AppContextState = {
    participants: string[];
    assigned: Map<string, string | null>;
    updateParticipants: (participants: string[]) => void;
};

const AppContext = createContext<AppContextState>({
    participants: [],
    updateParticipants: () => {},
    assigned: new Map(),
});

function App() {
    const [participants, setParticipants] = useState<string[]>([]);

    const getRandomName = (names: string[], except: string) => {
        const filteredNames = names.filter((name) => name !== except);
        return filteredNames[Math.floor(Math.random() * filteredNames.length)];
    };

    const generateAssignees = (names: string[]) => {
        const assigned = new Map<string, string | null>();

        let n = names;

        names.forEach((name) => {
            const assignedName = getRandomName(n, name);

            assigned.set(name, assignedName);
            n = n.filter((n) => n !== assignedName);
        });

        return assigned;
    };

    const assigned = useMemo(() => {
        const assigned = new Map<string, string | null>();
        participants.forEach((participant) => {
            assigned.set(participant, null);
        });

        if (participants.length % 2 === 0) {
            return generateAssignees(participants);
        }

        return assigned;
    }, [participants]);

    return (
        <div className="min-h-full">
            <header className="min-h-[300px] bg-white flex flex-col gap-4 items-center justify-center">
                <img className="w-32 h-32" src={Santa} />
                <h1 className="text-4xl font-bold text-gray-800">
                    Secret Santa Generator
                </h1>
            </header>
            <main className="container mx-auto max-w-5xl py-6 px-4">
                <AppContext.Provider
                    value={{
                        participants: participants,
                        updateParticipants: setParticipants,
                        assigned,
                    }}
                >
                    <AddPartcipant />

                    <Partcipants />
                </AppContext.Provider>
            </main>
        </div>
    );
}

export default App;

const AddPartcipant = () => {
    const { participants, updateParticipants } = useContext(AppContext);

    const [name, setName] = useState('');

    const [canAdd, setCanAdd] = useState(false);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);

        if (e.target.value.length > 0) {
            setCanAdd(true);
        }
    };

    const onAdd = () => {
        updateParticipants([...participants, name]);
        setCanAdd(false);
        setName('');
    };

    return (
        <div className="flex items-center justify-center gap-6">
            <input
                className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                type={'text'}
                value={name}
                onChange={onChange}
                placeholder={'Enter name'}
            />
            <button
                disabled={!canAdd}
                onClick={onAdd}
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 disabled:hover:bg-blue-600 disabled:opacity-75 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-blue-700 focus:outline-none"
            >
                Add Participant
            </button>
        </div>
    );
};

const Partcipants = () => {
    const { participants, updateParticipants, assigned } =
        useContext(AppContext);

    const onDelete = (index: number) => {
        const newParticipants = [...participants];
        newParticipants.splice(index, 1);
        updateParticipants(newParticipants);
    };

    return (
        <div className="mt-4 flex flex-col gap-6">
            {participants.map((p, pIdx) => (
                <PartcipantRow
                    key={`p-${pIdx}`}
                    name={p}
                    assigned={assigned.get(p) ?? null}
                    onRemoveClick={onDelete}
                    index={pIdx}
                />
            ))}
        </div>
    );
};

type PartcipantRowProps = {
    index: number;
    name: string;
    assigned: string | null;
    onRemoveClick: (index: number) => void;
};
const PartcipantRow: React.FC<PartcipantRowProps> = ({
    index,
    name,
    assigned,
    onRemoveClick,
}) => {
    return (
        <div className="bg-white p-4 rounded-md">
            <div className="flex gap-4">
                <input
                    className="w-full block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    type={'text'}
                    value={name}
                    readOnly
                />
                <input
                    className="w-full block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    type={'text'}
                    value={assigned ?? 'Not assigned'}
                    readOnly
                />
                <button
                    onClick={() => onRemoveClick(index)}
                    className="inline-flex items-center rounded-md border border-transparent bg-red-600 hover:bg-red-700 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm focus:outline-none"
                >
                    Remove
                </button>
            </div>
        </div>
    );
};
