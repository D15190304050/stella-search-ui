import MindMap from "simple-mind-map";
import {useEffect} from "react";

const createMindMap = () =>
{
    const element = document.getElementById("mindMapContainer");
    if (element instanceof HTMLElement)
    {
        console.log("element size: width = " + element.offsetWidth + ", height = " + element.offsetHeight);
    }

    const mindMap: MindMap = new MindMap({
        el: element,
        data: {
            data: {
                text: "根节点",
            },
            children: [
                {
                    data: {
                        text: "Outline 1"
                    },
                    children: []
                },
                {
                    data: {
                        text: "Outline 2"
                    },
                    children: []
                }
            ],
        },
    });
}

const MindMapView = () =>
{
    useEffect(() =>
    {
        createMindMap();
    });

    return (
        <div id={"mindMapContainer"}></div>
    );
}

export default MindMapView;