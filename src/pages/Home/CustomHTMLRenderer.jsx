// CustomHTMLRenderer.jsx
import parse, { domToReact } from 'html-react-parser';
import styleToObject from 'style-to-object';
import { camelCase } from 'lodash';

const convertStyleKeysToCamelCase = (styleObj) => {
    const camelCaseStyles = {};
    for (const key in styleObj) {
        camelCaseStyles[camelCase(key)] = styleObj[key];
    }
    return camelCaseStyles;
};

const CustomHTMLRenderer = ({ html, className = '', imageUrls = [] }) => {
    let imageIndex = 0;

    // Preprocess HTML to replace blob URLs with imageUrls
    let processedHtml = html;
    if (imageUrls.length > 0) {
        processedHtml = html.replace(/<img[^>]+src=["'](blob:[^"']+)["']/g, () => {
            if (imageIndex < imageUrls.length) {
                const newSrc = `<img src="${imageUrls[imageIndex]}"`;
                console.log(`Replacing blob URL with: ${imageUrls[imageIndex]}`); // Debug
                imageIndex++;
                return newSrc;
            }
            console.log('No more image URLs available, keeping original src'); // Debug
            return '<img src=""';
        });
    }

    console.log('Processed HTML:', processedHtml); // Debug
    console.log('imageUrls:', imageUrls); // Debug

    return (
        <div className={className}>
            {parse(processedHtml, {
                replace: (domNode) => {
                    // Handle <img> tags
                    if (domNode.name === 'img') {
                        const src = domNode.attribs.src || '';
                        // Preserve width and height from editor if present
                        const width = domNode.attribs.width || 'auto';
                        const height = domNode.attribs.height || '500px'; // Default to 500px to match featured image
                        console.log(`Rendering img with src: ${src}, width: ${width}, height: ${height}`); // Debug
                        return (
                            <img
                                src={src}
                                alt={domNode.attribs.alt || `Post image ${imageIndex + 1}`}
                                className="w-full object-cover rounded-sm my-4"
                                style={{ width, height }} // Apply width and height inline
                                onError={(e) => console.error(`Error loading image: ${src}`, e)}
                            />
                        );
                    }

                    // Handle placeholders (optional)
                    if (domNode.type === 'comment' && domNode.data.trim() === 'IMAGE_PLACEHOLDER') {
                        if (imageIndex < imageUrls.length) {
                            console.log(`Inserting image at placeholder: ${imageUrls[imageIndex]}`); // Debug
                            const imgTag = (
                                <img
                                    src={imageUrls[imageIndex]}
                                    alt={`Post image ${imageIndex + 1}`}
                                    // className="w-full object-cover rounded-sm my-4"
                                    style={{ width: '100%', height: '500px', objectFit: 'cover' }} // Default size
                                    onError={(e) => console.error(`Error loading image ${imageIndex + 1}:`, e)}
                                />
                            );
                            imageIndex++;
                            return imgTag;
                        }
                        console.log('No image available for placeholder'); // Debug
                        return null;
                    }

                    // Existing handlers
                    if (domNode.name === 'h1') {
                        return <h1 className="text-3xl font-bold">{domToReact(domNode.children)}</h1>;
                    }

                    if (domNode.name === 'h2') {
                        return <h2 className="text-2xl font-semibold my-4">{domToReact(domNode.children)}</h2>;
                    }

                    if (domNode.name === 'h3') {
                        return <h3 className="text-xl font-semibold">{domToReact(domNode.children)}</h3>;
                    }

                    if (domNode.name === 'h4') {
                        return (
                            <h4 className="text-lg font-medium text-gray-700 my-2">
                                {domToReact(domNode.children)}
                            </h4>
                        );
                    }

                    if (domNode.name === 'blockquote') {
                        return (
                            <blockquote className="border-l-4 border-gray-600 pl-4 italic text-gray-600 my-4">
                                {domToReact(domNode.children)}
                            </blockquote>
                        );
                    }

                    if (domNode.name === 'code') {
                        return (
                            <code className="bg-gray-100 text-red-500 px-1 py-0.5 rounded text-sm">
                                {domToReact(domNode.children)}
                            </code>
                        );
                    }

                    if (domNode.name === 'p') {
                        const props = {
                            ...domNode.attribs,
                            className: 'text-gray-700 line-clamp-8',
                        };

                        if (props.style) {
                            try {
                                const parsed = styleToObject(props.style);
                                props.style = convertStyleKeysToCamelCase(parsed);
                            } catch (e) {
                                console.error('Style parsing failed', e);
                                delete props.style;
                            }
                        }

                        return (
                            <div className="my-2">
                                <p {...props}>{domToReact(domNode.children)}</p>
                            </div>
                        );
                    }

                    if (domNode.name === 'b' || domNode.name === 'strong') {
                        return <strong className="font-bold">{domToReact(domNode.children)}</strong>;
                    }

                    if (domNode.name === 'i' || domNode.name === 'em') {
                        return <em className="italic">{domToReact(domNode.children)}</em>;
                    }

                    if (domNode.name === 'u') {
                        return <u className="underline">{domToReact(domNode.children)}</u>;
                    }

                    if (domNode.name === 'ul') {
                        return <ul className="list-disc pl-6 my-2">{domToReact(domNode.children)}</ul>;
                    }

                    if (domNode.name === 'ol') {
                        return <ol className="list-decimal pl-6 my-2">{domToReact(domNode.children)}</ol>;
                    }

                    if (domNode.name === 'li') {
                        return <li className="mb-1">{domToReact(domNode.children)}</li>;
                    }

                    if (domNode.name === 'br') {
                        return <br />;
                    }

                    if (domNode.name === 'table') {
                        return (
                            <table className="w-full border border-collapse border-gray-300 my-4">
                                {domToReact(domNode.children)}
                            </table>
                        );
                    }

                    if (domNode.name === 'thead') {
                        return <thead className="bg-gray-100">{domToReact(domNode.children)}</thead>;
                    }

                    if (domNode.name === 'tbody') {
                        return <tbody>{domToReact(domNode.children)}</tbody>;
                    }

                    if (domNode.name === 'tr') {
                        return <tr className="border border-gray-300">{domToReact(domNode.children)}</tr>;
                    }

                    if (domNode.name === 'th') {
                        return (
                            <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-left text-gray-800">
                                {domToReact(domNode.children)}
                            </th>
                        );
                    }

                    if (domNode.name === 'td') {
                        return (
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">
                                {domToReact(domNode.children)}
                            </td>
                        );
                    }

                    return undefined;
                },
            })}
        </div>
    );
};

export default CustomHTMLRenderer;