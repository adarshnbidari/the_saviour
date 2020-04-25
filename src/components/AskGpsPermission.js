import React, { Component } from 'react';

import '../css/AskGpsPermission.css';

export default class AskGpsPermission extends Component {


    componentDidMount = () => {

        document.querySelector("#closeDialogScreen").addEventListener('click', () => {

            document.querySelector("#backgroundScreen").style.display = "none";

            this.props.askingHelp(false);

        });


        document.querySelector("#help").addEventListener('click', () => {

            this.props.askingHelp(true);


        });


        document.querySelector("#nohelp").addEventListener('click', () => {

            this.props.askingHelp(false);

        });


    }


    render() {

        return (

            <div id="backgroundScreen" style={{ display: this.props.needToDisplay ? 'flex' : 'none' }}>

                <div id="optionDialogScreen">

                    <div id="dialogTitleArea">

                        <b>Do you need help during this pandemic?</b>

                        <span id="closeDialogScreen">&#10006;</span>

                    </div>

                    <div id="userSelectionBtn">

                        <button id="help">Yes</button>
                        <button id="nohelp">No</button>

                    </div>

                </div>


            </div>

        );

    }



}