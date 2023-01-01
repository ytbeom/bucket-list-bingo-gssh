import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import './BingoViewer.css';
import { getBucketListByUserId, postBucketListItem } from '../api/API';
import { setScreenSize, checkPassword } from '../Util';

function BingoViewer() {
    const { id } = useParams();
    const [ items, setItems ] = useState([]);
    const [ lines, setLines ] = useState(0);
    const [ selectedItem, setSelectedItem ] = useState(null);

    useEffect(() => {
        setScreenSize();
        window.addEventListener('resize', setScreenSize);
        return () => {
            window.removeEventListener('resize', setScreenSize)
        }
    }, [])

    useEffect(() => {
        if (!checkPassword(sessionStorage.getItem('bucket-list-bingo-password'))) {
            const password = prompt("ENTER PASSWORD")
            if (checkPassword(password)) {
                sessionStorage.setItem('bucket-list-bingo-password', password)
            }
            else {
                alert("올바르지 않은 비밀번호입니다.");
                return;
            }
        }
        getBucketListByUserId(id)
            .then(response => {
                setItems(response.data);
                setSelectedItem(null);
                checkBingo(response.data);
            })
            .catch(error => {
                alert('문제가 발생했습니다. 잠시 후 다시 시도해주세요.')
            })
    }, [id])

    const checkBingo = (items) => {
        let _lines = 0;
        let i, j, checked;

        // check diagonal direction
        if (items[0].complete &&
            items[6].complete &&
            items[12].complete &&
            items[18].complete &&
            items[24].complete) {
            _lines++;
        }
        if (items[4].complete &&
            items[8].complete &&
            items[12].complete &&
            items[16].complete &&
            items[20].complete) {
            _lines++;
        }

        // check row direction
        for (i = 0; i < 5; i++) {
            checked = true;
            for (j = 0; j < 5 && checked; j++) {
                checked = checked && items[i * 5 + j].complete
            }
            if (checked) {
                _lines++;
            }
        }

        // check column direction
        for (i = 0; i < 5; i++) {
            checked = true;
            for (j = 0; j < 5 && checked; j++) {
                checked = checked && items[i + j * 5].complete
            }
            if (checked) {
                _lines++;
            }
        }

        setLines(_lines)
    }

    const handleBoardOnClick = (e) => {
        const data = JSON.parse(e.target.getAttribute('custom-data'))
        setSelectedItem(data)
    }

    const handleOutsideOnClick = (e) => {
        if (e.target.id === 'popup-div')
            setSelectedItem(null)
    }

    const handleCloseButtonOnClick = (e) => {
        setSelectedItem(null)
    }

    const handleCompleteButtonOnClick = (e) => {
        const item = {
            'id': selectedItem.id,
            'complete': true
        }
        postBucketListItem(item)
            .then(response => {
                const _items = items.map(function(item) {
                    return item.id === response.data.id ? response.data : item;
                });
                setItems(_items)
                checkBingo(_items)
                setSelectedItem(null)
            })
            .catch(error => {
                alert('문제가 발생했습니다. 잠시 후 다시 시도해주세요.')
            })
    }

    const handleNotCompleteButtonOnClick = (e) => {
        const item = {
            'id': selectedItem.id,
            'complete': false
        }
        postBucketListItem(item)
            .then(response => {
                const _items = items.map(function(item) {
                    return item.id === response.data.id ? response.data : item;
                });
                setItems(_items)
                checkBingo(_items)
                setSelectedItem(null)
            })
            .catch(error => {
                alert('문제가 발생했습니다. 잠시 후 다시 시도해주세요.')
            })
    }

    return (
        <>
            <div id='bingo-viewer-div'>
                <div id='count-div'>{lines} Bingo</div>
                <div id='board-div'>
                    {items.map((item) => (
                        <div
                            className={(item.complete ? "completed": "")}
                            key={item.id}
                            custom-data={JSON.stringify(item)}
                            onClick={handleBoardOnClick}
                        >
                            {item.num}
                        </div>
                    ))}
                </div>
            </div>
            {selectedItem !== null && <div id='popup-div' onClick={handleOutsideOnClick}>
                <div id='popup-content'>
                    <div id='popup-content-header'>
                        <p>{selectedItem.num}</p>
                        <CloseIcon onClick={handleCloseButtonOnClick}/>
                    </div>
                    <div id='popup-content-body'>{selectedItem.title}</div>
                    <button onClick={handleCompleteButtonOnClick} disabled={selectedItem.complete}>Mark Complete</button>
                    <button onClick={handleNotCompleteButtonOnClick} disabled={!selectedItem.complete}>Mark Incomplete</button>
                </div>
            </div>}
        </>
    )
}

export default BingoViewer;
