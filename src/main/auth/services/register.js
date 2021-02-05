import Client from "../../../_rest/models/Client";
import User from "../../../_rest/models/User";
import { validateBrandName, validateUserEmail } from "../utils/misc";
import { validateRegister } from "../validation/register";
import { encrypt, hashString } from "../utils/encryption";

export const attemptRegister = async data => {
  const fields = await validateRegister(data);

  await validateUserEmail(fields.email, false);

  await validateBrandName(fields.brand_name);

  // ensure that government_id exists in media

  const client = await Client.create({
    brand: {
      name: fields.brand_name,
    },
    location: {
      city: fields.city,
      zone: fields.city,
    },
    account: {
      rib: encrypt(fields.rib),
      bank_name: encrypt(fields.bank_name),
    },
  });

  const user = await User.create({
    name: fields.name,
    government: fields.government,
    email: fields.email,
    phone: fields.phone,
    password: await hashString(fields.password),
    role: "client",
    client: client._id,
  });

  return {
    user: { _id: user._id, name: user.name, email: user.email },
    client: {
      _id: client._id,
      brand: { name: client.brand.name },
      location: { city: client.location.city },
    },
  };
};
