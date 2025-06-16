import Mii from "mii-js";

const baseMii = `AwEAMNdMp2tKLazBgP9wmcJzxI4qMgAAAABNAGkAaQAAAAAAAAAAAAAAAAAAAEBAAAAhAQJoRBgmNEYUgRIXaA0AACkAUkhQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH+v`;
export function getRanomMiiData() {
    const mii = new Mii(Buffer.from(baseMii, "base64"));

    mii.birthMonth = Math.floor(Math.random() * 12) + 1;
    mii.birthDay = Math.floor(Math.random() * 28) + 1;
    mii.favoriteColor = Math.floor(Math.random() * 12);

    mii.height = Math.floor(Math.random() * 127);
    mii.build = Math.floor(Math.random() * 127);

    mii.faceType = Math.floor(Math.random() * 12);
    mii.skinColor = Math.floor(Math.random() * 7);
    mii.hairType = Math.floor(Math.random() * 132);
    mii.hairColor = Math.floor(Math.random() * 8);
    mii.flipHair = Math.random() < 0.5;

    mii.eyeType = Math.floor(Math.random() * 60);
    mii.eyeColor = Math.floor(Math.random() * 6);

    mii.eyebrowType = Math.floor(Math.random() * 25);
    mii.eyebrowColor = mii.hairColor;

    mii.mouthType = Math.floor(Math.random() * 36);

    mii.glassesType = Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 9);
    mii.glassesColor = Math.floor(Math.random() * 6);

    return mii.encode().toString("base64");
}

// const urlPrefix = `https://mii-unsecure.ariankordi.net/miis/image.png?type=face&width=270&data=`;
export async function getMiiImage(data, additionalParams = "") {
    // const f = await fetch(`${urlPrefix}${data}${additionalParams ? `&${additionalParams}` : ""}`);
    const mii = new Mii(Buffer.from(data, "base64"));
    const f = await fetch(mii.studioUrl({ width: 128 }));
    if(!f.ok) throw new Error(`Failed to fetch Mii image: ${f.status} ${f.statusText}`);
    return Buffer.from(await f.arrayBuffer());
}