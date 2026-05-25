export interface SkinTypeType {
    id: number;
    name: string;
}

const SKIN_TYPE_KEY = 'skin_types';

export const getSkinTypes = async (): Promise<{
    data: SkinTypeType[];
}> => {

    const skinTypes =
        localStorage.getItem(
            SKIN_TYPE_KEY,
        );

    return {
        data: skinTypes
            ? JSON.parse(skinTypes)
            : [],
    };
};

export const createSkinType = async (
    skinType: SkinTypeType,
) => {

    const oldSkinTypes =
        localStorage.getItem(
            SKIN_TYPE_KEY,
        );

    const skinTypes: SkinTypeType[] =
        oldSkinTypes
            ? JSON.parse(oldSkinTypes)
            : [];

    skinTypes.push(skinType);

    localStorage.setItem(
        SKIN_TYPE_KEY,
        JSON.stringify(skinTypes),
    );

    return {
        data: skinType,
    };
};

export const deleteSkinType = async (
    id: number,
) => {

    const oldSkinTypes =
        localStorage.getItem(
            SKIN_TYPE_KEY,
        );

    const skinTypes: SkinTypeType[] =
        oldSkinTypes
            ? JSON.parse(oldSkinTypes)
            : [];

    const newSkinTypes =
        skinTypes.filter(
            (item) => item.id !== id,
        );

    localStorage.setItem(
        SKIN_TYPE_KEY,
        JSON.stringify(newSkinTypes),
    );
};