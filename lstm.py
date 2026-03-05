import numpy as np
import pandas as pd

np.random.seed(42)

n_samples = 10000
poll_interval = 0.5

L = 40
H = 60

water_level = 50
pump_state = 0

attack_windows = {
    "Recon": np.random.randint(1500, 2500),
    "Response_Injection": np.random.randint(3500, 4500),
    "Command_Injection": np.random.randint(5500, 6500),
    "DoS": np.random.randint(7500, 8500)
}

data = []

for t in range(n_samples):

    attack_label = 0  # 0 = Normal

    timestamp = t * poll_interval
    device_id = 1
    function_code = 3
    control_mode = 1
    packet_length = np.random.choice([64, 72])
    response_time = np.random.normal(0.02, 0.003)
    crc_error = 0

    temp_L = L
    temp_H = H

    # ------------------------
    # Inject Subtle Attacks
    # ------------------------

    if attack_windows["Command_Injection"] < t < attack_windows["Command_Injection"] + 400:
        attack_label = 1
        temp_L = 30
        temp_H = 50

    elif attack_windows["Recon"] < t < attack_windows["Recon"] + 400:
        attack_label = 1
        device_id = np.random.randint(2, 6)
        function_code = np.random.randint(1, 6)

    elif attack_windows["Response_Injection"] < t < attack_windows["Response_Injection"] + 400:
        attack_label = 1
        water_level += np.random.normal(3, 1)

    elif attack_windows["DoS"] < t < attack_windows["DoS"] + 400:
        attack_label = 1
        response_time = np.random.normal(0.001, 0.0005)
        crc_error = 1

    # ------------------------
    # Control Logic
    # ------------------------

    if water_level < temp_L:
        pump_state = 1
    elif water_level > temp_H:
        pump_state = 0

    if pump_state == 1:
        water_level += 0.3
    else:
        water_level -= 0.15

    water_level += np.random.normal(0, 0.05)

    data.append([
        timestamp,
        device_id,
        function_code,
        packet_length,
        response_time,
        crc_error,
        water_level,
        pump_state,
        control_mode,
        temp_L,
        temp_H,
        attack_label
    ])

columns = [
    "timestamp",
    "device_id",
    "function_code",
    "packet_length",
    "response_time",
    "crc_error",
    "water_level",
    "pump_state",
    "control_mode",
    "setpoint_L",
    "setpoint_H",
    "attack_label"
]

df = pd.DataFrame(data, columns=columns)
df.to_csv("synthetic_ics_dataset.csv", index=False)

print("Dataset Generated Successfully")
