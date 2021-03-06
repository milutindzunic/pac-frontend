import React from 'react';
import {Link, useParams, withRouter} from "react-router-dom";
import rest from "../../utils/rest";
import ContentEditable from 'react-contenteditable'

const TalkDetails = () => {
    const [talk, setTalk] = React.useState({
        title: "",
        language: "",
        level: "",
        persons: [],
        topics: [],
        talkDates: [],
    });
    const [error, setError] = React.useState("");

    const param = useParams();

    React.useEffect(() => {
        async function fetchData() {
            try {
                const talk = await rest.doGet(`${process.env.REACT_APP_HOST}/talks/${param.id}`);

                setTalk(talk.data);
            } catch (e) {
                setError(e.message);
            }
        }

        fetchData();
    }, [param, error]);

    const handleChange = (evt) => {
        async function updateTalkData() {
            try {
                const updatedTalk = await rest.doPut(
                    `${process.env.REACT_APP_HOST}/talks/${param.id}`,
                    {...talk, title: evt.target.value},
                    {},
                    {"Authorization": "Bearer " + localStorage.getItem('kc_token')});
                setTalk(updatedTalk.data);
            } catch (e) {
                setError(e.message);
            }
        }

        updateTalkData();
    };

    const {
        title,
        language,
        level,
        persons,
        topics,
        talkDates,
    } = talk;

    return (
        <div className="container">
            <div className="row mt-5">
                <dl className="row">
                    <dt className="col-sm-3">Talk Title</dt>
                    <dd className="col-sm-9">
                        <ContentEditable
                            html={title}
                            disabled={false}
                            onChange={handleChange}
                            tagName=''
                        />
                    </dd>

                    <dt className="col-sm-3">Language</dt>
                    <dd className="col-sm-9">{language}</dd>

                    <dt className="col-sm-3">Level</dt>
                    <dd className="col-sm-9">{level}</dd>

                    <dt className="col-sm-3">Persons</dt>
                    <dd className="col-sm-9">
                        {persons.map((person) =>
                            <Link key={person.id} to={"/speakerDetails/" + person.id} className="card-link">{person.name}</Link>
                        )}
                    </dd>

                    <dt className="col-sm-3">Topics</dt>
                    <dd className="col-sm-9">
                        {topics.map((topic) =>
                            <span key={topic.id} className="badge badge-info mx-1">{topic.name}</span>
                        )}
                    </dd>

                    <dt className="col-sm-3">Events</dt>
                    <dd className="col-sm-9">
                        {talkDates.map((talkDate) =>
                            <Link key={talkDate.id} to={"/eventDetails/" + talkDate.event.id} className="card-link">{talkDate.event.name}</Link>
                        )}
                    </dd>
                </dl>
            </div>
        </div>
    );
}

export default withRouter(TalkDetails);