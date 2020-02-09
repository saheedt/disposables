import React, { FC } from 'react';

interface TagType {
    [key: string]: string
}
interface PropType {
    wrapper: string,
    title?: string,
    children?: React.ReactChild,
    externalStyle?: any,
    header?: string,
}

const SubContainer: FC<PropType> = ({ wrapper, title, children, externalStyle, header }) => {
    const wrapperTags = { section: 'section', div: 'div' };
    const headingTags = { h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5', h6: 'h6' };

    const getTagType = (tag_obj: TagType , selected: string): {type : string} => {
        return { type: tag_obj[selected]}
    }
    const wrapperType = getTagType(wrapperTags, wrapper);
    const headerType = getTagType(headingTags, header);

    const SelectedWrapper = `${wrapperType.type}` as keyof JSX.IntrinsicElements;
    const SelectedHeading = `${headerType.type}` as keyof JSX.IntrinsicElements;

    const renderHeader = (title: string) => {
        return title ?
            <header className="sub-container-header">
                <SelectedHeading><span>{title}</span></SelectedHeading>
            </header>
            :
            <></>
    };

    return (
        <SelectedWrapper className={`sub-container ${externalStyle}`}>
            {renderHeader(title)}
            <div className="sub-container-child">
                {children}
            </div>
        </SelectedWrapper>
    );
};

export default SubContainer;