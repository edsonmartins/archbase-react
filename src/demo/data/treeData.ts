import { ArchbaseTreeNode } from "../../components/list";

export const treeData: ArchbaseTreeNode[] = [
    {
        "id": "6fe2431e-31f3-431f-a531-85ca7cd9fa30",
        "nodes": [
            {
                "id": "1392e87b-9182-4309-922e-082faffe22f5",
                "isleaf": true,
                "state": {
                    "selected": false,
                    "expanded": false,
                    "loading": false
                },
                "text": "Child Node 1",
                "color": "red",
                "backgroundColor": "white",
                "image": "url_to_image1",
                "data": {
                    "description": "This is a leaf node"
                },
                "type": "SELECTABLE"
            },
            {
                "id": "280633d8-fda0-4086-86d6-baa87453a6f3",
                "isleaf": false,
                "state": {
                    "selected": true,
                    "expanded": true,
                    "loading": false
                },
                "text": "Child Node 2",
                "color": "blue",
                "backgroundColor": "black",
                "image": "url_to_image2",
                "nodes": [
                    {
                        "id": "194be853-e9a4-438a-8043-5547bb32bb92",
                        "isleaf": true,
                        "state": {
                            "selected": false,
                            "expanded": false,
                            "loading": false
                        },
                        "text": "Grandchild Node 1",
                        "color": "green",
                        "backgroundColor": "yellow",
                        "image": "url_to_image3",
                        "data": {
                            "details": "Empty branch"
                        },
                        "type": "SELECTABLE"
                    },
                    {
                        "id": "f7888fac-f1f0-4c52-b8b9-2f809d104133",
                        "isleaf": false,
                        "state": {
                            "selected": false,
                            "expanded": true,
                            "loading": true
                        },
                        "text": "Grandchild Node 2",
                        "color": "purple",
                        "backgroundColor": "orange",
                        "image": "url_to_image4",
                        "nodes": [],
                        "data": {
                            "info": "Empty branch"
                        },
                        "type": "SELECTABLE"
                    },
                    {
                        "id": "074a21b2-b5b4-4b53-944a-d53d4d7540f7",
                        "isleaf": false,
                        "state": {
                            "selected": false,
                            "expanded": true,
                            "loading": true
                        },
                        "text": "Grandchild Node 3",
                        "color": "blue",
                        "backgroundColor": "orange",
                        "image": "url_to_image4",
                        "nodes": [],
                        "data": {
                            "info": "Empty branch"
                        },
                        "type": "SELECTABLE"
                    }
                ],
                "type": "SELECTABLE"
            },{
                "id": "530c819d-2e70-4ae0-afea-3e4c9216e169",
                "isleaf": false,
                "state": {
                    "selected": true,
                    "expanded": true,
                    "loading": false
                },
                "text": "Child Node 3",
                "color": "blue",
                "backgroundColor": "black",
                "image": "url_to_image2",
                "nodes": [
                    {
                        "id": "21c7e6d2-fdda-4970-9a31-83c905675f12",
                        "isleaf": true,
                        "state": {
                            "selected": false,
                            "expanded": false,
                            "loading": false
                        },
                        "text": "Grandchild Node 1",
                        "color": "indigo",
                        "backgroundColor": "yellow",
                        "image": "url_to_image3",
                        "data": {
                            "details": "Leaf of a branch"
                        },
                        "type": "SELECTABLE"
                    },
                    {
                        "id": "886a1bd7-f056-4921-8251-01b22693ab48",
                        "isleaf": false,
                        "state": {
                            "selected": false,
                            "expanded": true,
                            "loading": true
                        },
                        "text": "Grandchild Node 2",
                        "color": "deeppink",
                        "backgroundColor": "orange",
                        "image": "url_to_image4",
                        "nodes": [
                            {
                                "id": "4e6eb9f8-45b8-483a-9de3-175701210dc4",
                                "isleaf": false,
                                "state": {
                                    "selected": true,
                                    "expanded": true,
                                    "loading": false
                                },
                                "text": "GreatGrandChild Node 1",
                                "color": "blue",
                                "backgroundColor": "black",
                                "image": "url_to_image2",
                                "nodes": [
                                    {
                                        "id": "28f142ce-4aa4-485d-8b0c-09cc18a06687",
                                        "isleaf": true,
                                        "state": {
                                            "selected": false,
                                            "expanded": false,
                                            "loading": false
                                        },
                                        "text": "GreatGreatGrandchild Node 1",
                                        "color": "orangered",
                                        "backgroundColor": "yellow",
                                        "image": "url_to_image3",
                                        "data": {
                                            "details": "Leaf of a branch"
                                        },
                                        "type": "SELECTABLE"
                                    },
                                    {
                                        "id": "a8a3daf8-d403-406c-970d-3fb0871f1194",
                                        "isleaf": false,
                                        "state": {
                                            "selected": false,
                                            "expanded": true,
                                            "loading": true
                                        },
                                        "text": "GreatGreatGrandchild Node 2",
                                        "color": "dodgerblue",
                                        "backgroundColor": "orange",
                                        "image": "url_to_image4",
                                        "nodes": [],
                                        "data": {
                                            "info": "Empty branch"
                                        },
                                        "type": "SELECTABLE"
                                    }
                                ],
                                "type": "SELECTABLE"
                            }
                        ],
                        "data": {
                            "info": "Empty branch"
                        },
                        "type": "SELECTABLE"
                    }
                ],
                "type": "SELECTABLE"
            }
        ],
        "parentNode": null,
        "state": {
            "selected": true,
            "expanded": true,
            "loading": false
        },
        "text": "Root Node",
        "backgroundColor": "grey",
        "data": {
            "additionalInfo": "Root of the tree"
        }
    }
]
