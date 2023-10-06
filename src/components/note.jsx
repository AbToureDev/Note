import React, {useEffect, useState} from 'react';

const Note = () => {
    const [note, setNote] = useState({
        title: '',
        content: ''
    })
    const [datas, setDatas] = useState([])
    const handleChange =(v)=>{
        setNote(v)
    }
    const handleSave = async (e) => {
        e.preventDefault();
        if (note.title === '' || note.content === '') {
            alert('Veuillez remplir le champ title et content.');
        } else {
            try {
                const response = await fetch(
                    "http://localhost:5000/note",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            title: note.title,
                            content: note.content
                        }), // Vous pouvez directement envoyer l'objet 'note'
                    }
                );

                if (response.status === 200) {
                    // La requête a réussi (statut 201 signifie "Created")
                    alert('Note enregistrée avec succès.');
                    setNote({ title: '', content: '' }); // Réinitialisez l'état après l'enregistrement
                    window.location.reload();
                } else {
                    // Gérez d'autres codes d'état en conséquence
                    alert('Une erreur s\'est produite lors de l\'enregistrement de la note.');
                }
            } catch (error) {
                console.error('Une erreur s\'est produite :', error);
            }
        }
    };
    const handledelete = async (id) => {
        if (window.confirm("Souhaitez-vous vraiment quitter le site ?")) {
            // window.open("exit.html", "Merci de votre visite !");
            try {
                await fetch(
                    `http://localhost:5000/note/${id}`,
                    {
                        method: "DELETE",
                    }
                );
                window.location.reload();

            } catch (e) {
                console.log(e);
            }
        }
        console.log(id)
    };

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/note"
                );
                const notes: Note[] =
                    await response.json();
                setDatas(notes);
            } catch (e) {
                console.log(e);
            }
        };
        fetchNotes();
    }, []);
    console.log('note')
    // console.log(note.content)
    return (
        <>
            <div className={' flex bg-gray-400 h-[500px] gap-5'}>
                <aside className="w-[20%] flex flex-col top-0 gap-5 m-8">
                <input type="text" className='p-5 text-gray-400 border border-black-500 focus:text-black rounded'
                           placeholder='Title'
                           value={note.title}
                           onChange={(e)=>handleChange({...note,title:e.target.value})}
                    />
                    <textarea
                        rows={5}
                        cols={12}
                        placeholder={'Content'} className={'p-5 rounded-2xl'}
                        value={note.content}
                        onChange={(e)=>handleChange({...note,content:e.target.value})}
                    />
                    <button onClick={handleSave} className={'text-amber-50 bg-blue-500 hover:bg-blue-600 font-bold rounded-xl py-3'}>Add Note</button>
                </aside>
                <div>
                {/*<div className="flex m-5 flex-wrap overflow-hidden" style={{ overflowY: 'auto' }}>*/}
                    {
                        datas.length > 0 ?
                            datas?.map((dt,index) =>(
                                <div className="flex m-5 flex-wrap overflow-hidden" style={{ overflowY: 'auto' }}>
                                <div key={index} className={'bg-white rounded-lg' +
                                    ' h-[300px] w-[350px] sm:text-center p-2 m-2 relative '}>
                                    <div className={' '}>
                                        <h2 className={'font-bold text-center text-[30px]'}> {dt.title}</h2>
                                        <p className={'shadow-slate-500 text-xl '}> {dt.content}
                                        </p>
                                    </div>
                                        <p className={'text-xl font-bold top-0 right-2 hover:text-gray-400 z-10 absolute cursor-pointer'} onClick={()=>handledelete(dt.id)} >X</p>
                                </div>
                                </div>
                            ))
                            :
                            <div className={' m-52 w-full'}>
                                <p className={'text-amber-600 text-[25px] font-bold'}> vous ne disposez pas de notes actuellement !</p>
                            </div>
                    }

                </div>
            </div>
        </>
    );
};

export default Note;